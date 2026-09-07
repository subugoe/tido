import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/sidebar/Annotation.tsx'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'
import { getSource } from '@/utils/annotations.ts'
import { alignTextToAnnotation, handleExternalSelection } from '@/utils/annotation-alignment.ts'

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

  // The cards are absolutely positioned, so the list only gains height once every top value has been
  // committed. Until then there is nothing to scroll and scrollIntoViewIfNeeded would clamp to 0,
  // leaving the card at the very top of the sidebar however far down the list it really belongs.
  // Selections that arrive before that (i.e through config selectedAnnotationId) wait for this to flip;
  // once sidebar is scrollable, then we can scroll to the selectedAnnotation
  const [isSidebarScrollable, setIsSidebarScrollable] = useState(false)

  const ref = useRef(null)
  const isFirstMount = useRef(true)

  function isClickedElAnnotation(clickedEl: HTMLElement) {
    return clickedEl.closest('[data-annotation]')
  }

  // The scroller keeps the sidebar and the text views scrolling in lockstep, which is what this
  // list - and only this list - needs: its cards are positioned against their targets, so the two
  // sides have to move together. The plain list scrolls both containers independently, so the sync
  // runs for exactly as long as this component is mounted and is stopped again on unmount.
  useEffect(() => {
    const scroller = getScroller()
    scroller.startSync()

    return () => scroller.stopSync()
  }, [])

  useEffect(() => {
    const panelEl = document.getElementById(panelId) as HTMLElement
    const annotationsSideBarEl = panelEl?.querySelector('div[data-sidebar-scroll-container="true"]') as HTMLElement
    const controller = new AbortController()

    async function deselectAnnotationOnOutsideClick(event: MouseEvent) {
      // if we click at an annotation - we return false
      if (isClickedElAnnotation(event.target as HTMLElement)) return
      setSelectedAnnotation(null)
    }

    annotationsSideBarEl?.addEventListener('click', deselectAnnotationOnOutsideClick, { signal: controller.signal })

    // Cleanup on unmount
    return () => controller.abort()
  }, [selectedAnnotation])

  // Re-runs when a selection is made and again when the sidebar first becomes scrollable, which is
  // what a selection arriving before the cards were positioned is waiting for.
  useEffect(() => {
    const panelEl = document.getElementById(panelId) as HTMLElement

    if (!selectedAnnotation) return
    const controller = new AbortController()
    const scroller = getScroller()

    // The scroller's own scrollText: the sidebar and the text scroll in lockstep in this mode, so a
    // scroll started here has to keep the sync listeners out until it has come to a stop.
    const scrollText = (contentUrl: string, delta: number) => scroller.scrollText(contentUrl, delta)

    if (selectedAnnotation.origin === 'annotation') {
      scroller.setIsSyncing(true)
      alignTextToAnnotation(panelEl, selectedAnnotation.annotation, scrollText)
      return
    }

    if (selectedAnnotation.origin === 'text') {
      // we do not sync sidebar to text here, since the annotations are not rendered, the sidebar is not yet scrollable
      // and the scrollTop would become 0
      trackTopChange()
      return
    }

    // Everything else - cross ref, bookmarking, a selectedAnnotationId in the config - has to scroll
    // the sidebar to the annotation first. Computing the positions is what makes that possible, and this
    // effect runs again once they are in.
    if (!isSidebarScrollable) {
      trackTopChange()
      return
    }

    scroller.setIsSyncing(true)
    handleExternalSelection(panelEl, selectedAnnotation.annotation, controller.signal, scrollText)

    return () => controller.abort()
  }, [selectedAnnotation, isSidebarScrollable])

  // Runs after yMap is committed - i.e. once the annotations are positioned and the sidebar has its
  // full scrollable height. Only then is it safe to sync the sidebar scroll to the text.
  useEffect(() => {
    const sidebar = getScroller().getSidebar()
    if (sidebar) setIsSidebarScrollable(sidebar.scrollHeight > sidebar.clientHeight)

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
      // a target of an annotation may lie in different panel views, i.e when 2 panel view are opened and target lies in 2 pane
      // we should be able to locate the textContainer in the 2nd pane
      const contentUrl = getSource(elements[i].annotation.target[0]).id
      const scrollParent = document.getElementById(panelId).querySelector(`[data-content-url="${contentUrl}"]`) as HTMLElement
      if (!scrollParent) continue

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
        // The same selector can match in several texts of the item, so the target has to be looked
        // up in the text the annotation points at - the one carrying its content url - and not
        // panel wide.
        const contentUrl = getSource(annotation.target[0]).id
        const textEl = document.getElementById(panelId).querySelector(`[data-content-url="${contentUrl}"]`) as HTMLElement
        if (!textEl) return

        const target = textEl.querySelector((annotation.target[0].selector as CssSelector).value) as HTMLElement
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
