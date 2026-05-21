import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/sidebar/Annotation.tsx'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'

const ANNOTATION_GAP = 5

const AlignAnnotationsList: FC = () => {
  const { panelId, selectedAnnotation, setSelectedAnnotation, getScroller, panelState } = usePanel()
  const { filteredAnnotations } = useAnnotations()

  // Elements represents an array of several infos for each visible annotation. These infos are needed to update the top
  // position of each annotation.
  const [elements, setElements] = useState([])

  const [textContainer] = useState(document.getElementById(panelId).querySelector(`[data-text-wrapper]`) as HTMLElement)
  const [yMap, setYMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(0)
  const [toggledAnnotation, setToggledAnnotation] = useState(null)

  const ref = useRef(null)

  function isClickedElAnnotation(clickedEl: HTMLElement) {
    return clickedEl.closest('[data-annotation]')
  }

  useEffect(() => {
    const panelEl = document.getElementById(panelId) as HTMLElement
    const annotationsSideBarEl = panelEl?.querySelector('div[data-sidebar-container="true"]') as HTMLElement

    if (!selectedAnnotation) return
    const { annotation, origin } = selectedAnnotation
    if (origin === 'text') {
      const scroller = getScroller()
      // here we need the activeContent url of the text container where the target was clicked. - to align with the right text pane
      const { contentUrl } = selectedAnnotation
      scroller.syncSidebarToText(contentUrl)
      trackTopChange()
    } else if (origin  === 'other') {
      // selectedAnnotation comes from Bookmarking or config
      const target = annotation.target[0]
      const targetSourceUrl = target.source
      const textEl = panelEl.querySelector(`div[data-content-url="${targetSourceUrl}"]`)
      const targetEl = textEl.querySelector((target.selector as CssSelector).value) as HTMLElement
      scrollIntoViewIfNeeded(targetEl, textEl as HTMLElement)
    }

    async function deselectAnnotationOnOutsideClick(event: MouseEvent) {
      // if we click at an annotation - we return false
      if (isClickedElAnnotation(event.target as HTMLElement)) return
      setSelectedAnnotation(null)
    }

    annotationsSideBarEl?.addEventListener('click', deselectAnnotationOnOutsideClick)

    // Cleanup on unmount
    return () => {
      annotationsSideBarEl?.removeEventListener('click', deselectAnnotationOnOutsideClick)
    }
  }, [selectedAnnotation])

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

    // Set the desiredY according to current target clean positions (clean = actual position in the text)
    for (let i = 0; i < elements.length; i++) {
      elements[i].desiredY = elements[i].target.getBoundingClientRect().top - textContainer.getBoundingClientRect().top
    }

    elements.sort((a, b) => a.desiredY - b.desiredY)


    for (let i = 0; i < elements.length; i++) {
      const annotationEl = elements[i]
      const lastHeight = i === 0 ? 0 : elements[i - 1].el.offsetHeight
      const lastY = i === 0 ? 0 : elements[i - 1].desiredY


      // The minimum top value needed if we want to place the current annotation right under the last one.
      const minY = lastY + lastHeight + ANNOTATION_GAP

      // Next, we decide if that minimum value is even needed or if the desiredY is more below and therefore should be used instead.
      const actualY = i === 0 ? annotationEl.desiredY : Math.max(annotationEl.desiredY, minY)

      if (selectedAnnotation && annotationEl.annotation.id === selectedAnnotation.annotation.id && actualY !== annotationEl.desiredY) {
        // If this is a selectedAnnotation, and it has some other annotations above
        // (which caused the current to move down, for example if the selected annotation is in the same row with multiple other annotations),
        // we want to move those annotations further above, so our selected one can be placed to the desiredY
        moveBefore(i)
        continue
      }
      annotationEl.desiredY = actualY
    }

    const map = elements.reduce((acc, cur) => {
      acc[cur.annotation.id] = cur.desiredY
      return acc
    }, {})

    setYMap(map)
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
    // Set height equal to textContainer height since the text can be way longer
    // than the position of the last annotation.
    setHeight(textContainer.getBoundingClientRect().height)

    if (filteredAnnotations?.length === 0) {
      setElements([])
    } else {
      const scroller = getScroller()
      const firstTextView = panelState.panelViews.find(v => v.view === 'text')
      const contentUrl = panelState.item?.contents.find(c =>
        c.contentType.includes(firstTextView?.activeContentType))?.id
      scroller.syncSidebarToText(contentUrl)

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
      setLoading(true)
      setElements([])
    }
  }, [filteredAnnotations])

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    if (elements.length > 0) {
      resizeObserver = new ResizeObserver(entries => {
        if (entries[0].contentRect.width > 0) trackTopChange()
      })
      resizeObserver.observe(textContainer)
    }

    setLoading(false)

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      if (timeout) clearTimeout(timeout)
    }
  }, [elements])


  if (filteredAnnotations.length > 0)
    return <div
      ref={ref}
      className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
      style={{ height: `${height}px` }}
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
