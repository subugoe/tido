import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'
import eventBus from '@/utils/event-bus.ts'
import panel from '@/components/panel/Panel.tsx'
import { isAutoScrolling, removeAutoScrolling, syncScrollPosition } from '@/utils/scroll.ts'

const ANNOTATION_GAP = 5

let scrollTimeout


const AnnotationsBody: FC = () => {
  const { panelState, panelId } = usePanel()
  const [mountedCount, setMountedCount] = useState(0)
  const [annotationEls, setAnnotationEls] = useState([])
  const [filteredAnnotations, setFilteredAnnotations] = useState([])
  const textContainer = document.getElementById(panelId).querySelector(`[data-panel="${panelId}"]`) as HTMLElement

  const ref = useRef()
  const handleChildMount = (target: HTMLElement, el: HTMLElement) => {
    setMountedCount(prev => prev + 1)
    annotationEls.push({
      target,
      el,
      desiredY: target.offsetTop
    })
    setAnnotationEls(annotationEls)
  }

  const handleAnnotationClick = (el: HTMLElement) => {
    annotationEls.forEach(({ el }) => el.removeAttribute('data-highlighted'))
    el.dataset.highlighted = 'true'
    trackTopChange()
  }

  function trackTopChange() {
    console.log('trackTopChange', annotationEls.length)
    if (annotationEls.length === 0) return

    // Set the desiredY according to current target positions
    for (let i = 0; i < annotationEls.length; i++) {
      console.log('target top', annotationEls[i].target.getBoundingClientRect().top, textContainer.getBoundingClientRect().top)
      annotationEls[i].desiredY = annotationEls[i].target.getBoundingClientRect().top - textContainer.getBoundingClientRect().top
    }

    annotationEls.sort((a, b) => a.desiredY - b.desiredY)

    for (let i = 0; i < annotationEls.length; i++) {
      const annotationEl = annotationEls[i]
      const lastHeight = i === 0 ? 0 : annotationEls[i - 1].el.offsetHeight
      const lastY = i === 0 ? 0 : annotationEls[i - 1].desiredY
      const minY = lastY + lastHeight + ANNOTATION_GAP

      let actualY = i === 0 ? annotationEl.desiredY : Math.max(annotationEl.desiredY, minY)

      console.log('y', minY, annotationEl.desiredY, actualY)


      if (annotationEl.el.dataset.highlighted && actualY !== annotationEl.desiredY) {
        actualY = annotationEl.desiredY
        annotationEl.desiredY = actualY
        moveBefore(i)
        continue
      }
      annotationEl.desiredY = actualY
    }

    annotationEls.forEach(({ el, desiredY }) => el.style.top = `${desiredY}px`)
  }

  function moveBefore(index: number) {
    if (index === 0) return
    const cur = annotationEls[index]
    const prev = annotationEls[index - 1]

    const prevEndY = prev.desiredY + prev.el.offsetHeight + ANNOTATION_GAP

    prev.desiredY = Math.min(prevEndY, cur.desiredY - (prev.el.offsetHeight + ANNOTATION_GAP))
    moveBefore(index - 1)
  }

  useEffect(() => {
    let resizeObserver
    if (mountedCount > 0 && mountedCount === filteredAnnotations.length) {
      resizeObserver = new ResizeObserver(entries => {
        console.log('ResizeObserver')
        if (entries[0].contentRect.width > 0) trackTopChange()
      })
      resizeObserver.observe(textContainer)
      ref.current.style.opacity = 1
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [mountedCount, filteredAnnotations])

  useEffect(() => {
    if (panelState.textRendered && panelState.annotations) {
      ref.current.style.height = `${textContainer.firstChild.offsetHeight}px`

      setFilteredAnnotations(panelState.annotations
        .filter(a => !!document.getElementById(panelId).querySelector(a.target[0].selector.value)))
    }

    return () => {
      if (ref.current) ref.current.style.opacity = 0
      setAnnotationEls([])
      setMountedCount(0)
    }
  }, [panelState.textRendered, panelState.annotations])

  return <div data-annotation-panel={panelId} className="relative border-t border-border bg-accent flex-1 px-2 h-full overflow-y-auto">
    <div ref={ref} className="transition-opacity">
      { filteredAnnotations.map(a => <Annotation data={a} key={a.id} onMount={handleChildMount} onClick={handleAnnotationClick} />)}
    </div>
  </div>
}

export default AnnotationsBody
