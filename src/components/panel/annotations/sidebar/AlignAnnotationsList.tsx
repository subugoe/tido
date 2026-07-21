import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/sidebar/Annotation.tsx'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { SelectedAnnotation } from '@/types'

const ANNOTATION_GAP = 5

const AlignAnnotationsList: FC = () => {
  const { panelId, selectedAnnotation, setSelectedAnnotation, getScroller } = usePanel()
  const { filteredAnnotations, setAlignmentLoading } = useAnnotations()

  // Elements represents an array of several infos for each visible annotation. These infos are needed to update the top
  // position of each annotation.
  const [elements, setElements] = useState([])

  const [textContainer] = useState(document.getElementById(panelId).querySelector(`[data-text-wrapper]`) as HTMLElement)
  const [yMap, setYMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [toggledAnnotation, setToggledAnnotation] = useState(null)

  const ref = useRef(null)
  const isFirstMount = useRef(true)

  function isClickedElAnnotation(clickedEl: HTMLElement) {
    return clickedEl.closest('[data-annotation]')
  }

  // Lines the text up with the card of the selected annotation. The card has to be standing still
  // before we can measure it, so when the sidebar first has to scroll the card into view we defer
  // the text scroll until that scroll has ended.
  function alignTextToAnnotation(panelEl: HTMLElement, selectedAnnotation: SelectedAnnotation, signal: AbortSignal) {
    const { annotation, origin } = selectedAnnotation
    const scroller = getScroller()
    const sidebar = scroller.getSidebar()
    const target = annotation.target[0]
    const targetSourceUrl = typeof target.source === 'string' ? target.source : target.source.id
    const textScrollContainer = scroller.getText(targetSourceUrl)
    if (!sidebar || !textScrollContainer) return

    const targetEl = textScrollContainer.querySelector((target.selector as CssSelector).value) as HTMLElement
    const annotationEl = panelEl.querySelector(`[data-annotation="${annotation.id}"]`) as HTMLElement
    if (!targetEl || !annotationEl) return

    // The sidebar does not move along with the text, so once it has settled the card's top is a
    // fixed reference: scrolling the text by the distance between the two puts the target exactly
    // on the card in a single scroll.
    function scrollTextToCard() {
      const delta = targetEl.getBoundingClientRect().top - annotationEl.getBoundingClientRect().top
      scroller.scrollText(targetSourceUrl, delta)
    }

    // A selection made in the sidebar itself needs no sidebar scroll: the card is where the user
    // just clicked, so the text can be aligned to it straight away.
    if (origin === 'annotation') {
      scrollTextToCard()
      return
    }

    // Returns the scrollTop the sidebar settles at. Getting the current one back means the card was
    // already in view and no scroll was started, so there is no scrollend to wait for.
    const settledScrollTop = scrollIntoViewIfNeeded(annotationEl, sidebar)
    if (settledScrollTop === sidebar.scrollTop) scrollTextToCard()
    else sidebar.addEventListener('scrollend', scrollTextToCard, { once: true, signal })
  }

  useEffect(() => {
    const panelEl = document.getElementById(panelId) as HTMLElement
    const annotationsSideBarEl = panelEl?.querySelector('div[data-sidebar-container="true"]') as HTMLElement

    if (!selectedAnnotation) return
    const controller = new AbortController()
    const scroller = getScroller()
    if (selectedAnnotation.origin === 'text') {
      // we do not sync sidebar to text here, since the annotations are not rendered, the sidebar is not yet scrollable
      // and the scrollTop would become 0
      trackTopChange()
    } else {
      // Cases: 1) select an annotation directly 2) external selection of annotation i.e due to cross ref link
      // text will align to selectedAnnotation, so it will programmatically scroll.
      // we do not want to scroll sidebar due to a programmatic scroll of textContainer
      // set "isSyncing" to true to prevent this
      scroller.setIsSyncing(true)
      alignTextToAnnotation(panelEl, selectedAnnotation, controller.signal)
    }

    async function deselectAnnotationOnOutsideClick(event: MouseEvent) {
      // if we click at an annotation - we return false
      if (isClickedElAnnotation(event.target as HTMLElement)) return
      setSelectedAnnotation(null)
    }

    annotationsSideBarEl?.addEventListener('click', deselectAnnotationOnOutsideClick, { signal: controller.signal })

    // Cleanup on unmount
    return () => controller.abort()
  }, [selectedAnnotation])

  // Runs after yMap is committed - i.e. once the annotations are positioned and the sidebar has its
  // full scrollable height. Only then is it safe to sync the sidebar scroll to the text.
  useEffect(() => {
    if (getScroller().getOriginSelection() !== 'text') return
    if (!selectedAnnotation?.contentUrl) return
    getScroller().syncSidebarToText(selectedAnnotation.contentUrl)
  }, [yMap])


  useEffect(() => {
    if (toggledAnnotation) {
      trackTopChange()
      setToggledAnnotation(null)
    }
  }, [toggledAnnotation])


  function trackTopChange() {
    // This function calculates all top positions from all currently visible annotations and sets them as "yMap" where
    // the key is the annotation id and the value is the top value.

    if (elements.length === 0) return

    // Set the desiredY according to current target clean positions (clean = actual position in the text + scrolled distance)
    for (let i = 0; i < elements.length; i++) {
      const scrollParent = elements[0].target.closest('[data-text-container]')
      const parentRect = scrollParent.getBoundingClientRect()
      const el = elements[i].target
      const elRect = el.getBoundingClientRect()

      // Distance from span to parent's visible top, plus how far parent has scrolled
      elements[i].desiredY = (elRect.top - parentRect.top) + scrollParent.scrollTop
    }

    elements.sort((a, b) => a.desiredY - b.desiredY)

    for (let i = 0; i < elements.length; i++) {
      const annotationEl = elements[i]
      const lastHeight = i === 0 ? 0 : elements[i - 1].el.offsetHeight
      const lastY = i === 0 ? 0 : elements[i - 1].desiredY

      // The minimum top value needed if we want to place the current annotation right under the last one.
      const minY = lastY + lastHeight + ANNOTATION_GAP

      // Next, we calculate the actual position that will be set to the annotation element.
      // For the first element, we just go with the desired position.
      // For all next elements, we check if the desired position is further below the minimum possible position.
      // If not, we go with the minimum position, which results in the "stacking" order of annotation.
      const actualY = i === 0 ? annotationEl.desiredY : Math.max(annotationEl.desiredY, minY)

      if (selectedAnnotation && annotationEl.annotation.id === selectedAnnotation.annotation.id && actualY !== annotationEl.desiredY) {
        // If this is a selectedAnnotation, and it has some other annotations above,
        // we have to align that annotation with the target in text.
        // Since this is exactly the "desiredY" position, we don't need to do anything here,
        // but we need to move all previous annotations further above if needed,
        // so their positions don't overlap with our selected one.
        moveBefore(i)
      } else {
        // Otherwise, we set the calculated position
        annotationEl.desiredY = actualY
      }
    }

    const map = elements.reduce((acc, cur) => {
      acc[cur.annotation.id] = cur.desiredY
      return acc
    }, {})

    setYMap(map)
    setLoading(false)
    setAlignmentLoading(false)
  }

  function moveBefore(index: number) {
    if (index === 0) return
    const cur = elements[index]
    const prev = elements[index - 1]

    const prevEndY = prev.desiredY + prev.el.offsetHeight + ANNOTATION_GAP

    prev.desiredY = Math.min(prevEndY, cur.desiredY - (prev.el.offsetHeight + ANNOTATION_GAP))
    moveBefore(index - 1)
  }

  useEffect(() => {
    if (!isFirstMount.current) {
      setLoading(true)
    } else {
      isFirstMount.current = false
    }
    setAlignmentLoading(true)
    if (filteredAnnotations?.length === 0) {
      setElements([])
      setLoading(false)
      setAlignmentLoading(false)
    } else {
      const annotationEls = Array.from(ref.current?.childNodes ?? [])
      const _elements = annotationEls.map(el => {
        const annotation = filteredAnnotations.find(a => a.id === (el as HTMLElement).getAttribute('data-annotation'))
        if (!annotation) return
        const target: HTMLElement = document.getElementById(panelId).querySelector((annotation.target[0].selector as CssSelector).value)
        if (!target) {
          console.error('There exists no target in text from the selector value of this annotation', annotation)
          return
        }

        return {
          target,
          el,
          desiredY: target.offsetTop,
          annotation
        }
      })
      setElements(_elements.filter(Boolean))
    }

    return () => {
      setElements([])
    }
  }, [filteredAnnotations])

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined
    if (elements.length > 0) {
      resizeObserver = new ResizeObserver(entries => {
        if (entries[0].contentRect.width > 0) trackTopChange()
      })
      resizeObserver.observe(textContainer)
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [elements])


  if (filteredAnnotations.length > 0)
    return <div
      ref={ref}
      className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
    >
      {filteredAnnotations.map(a => <Annotation
        data={a}
        key={a.id}
        top={yMap[a.id]}
        onToggle={setToggledAnnotation}
      />)}
    </div>
}

export default AlignAnnotationsList
