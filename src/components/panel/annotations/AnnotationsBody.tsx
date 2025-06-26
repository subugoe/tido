import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'

const annotationEls = []
const ANNOTATION_GAP = 5

const AnnotationsBody: FC = () => {
  const { panelState, panelId } = usePanel()
  const [mountedCount, setMountedCount] = useState(0)
  const [filteredAnnotations, setFilteredAnnotations] = useState([])
  const textContainer = document.getElementById(panelId).querySelector(`[data-panel="${panelId}"]`) as HTMLElement
  const containerTop = textContainer.getBoundingClientRect().top
  let frameId = null
  const handleChildMount = (target: HTMLElement, el: HTMLElement) => {
    setMountedCount(prev => prev + 1)
    annotationEls.push({ target, el, targetPrevTop: target.getBoundingClientRect().top })
  }

  function trackTopChange() {
    // Counts the times that an annotation overlaps the previous one. Resets each time an annotation was positioned normally.
    let overlappingCount = 0

    const changedEls = annotationEls
      .filter(({ target, targetPrevTop }) => target.getBoundingClientRect() !== targetPrevTop)

    if (!changedEls.length) return

    annotationEls.forEach(({ target, el, prevTargetTop }, i) => {

      const { top: targetTop } = target.getBoundingClientRect()

      if (targetTop !== prevTargetTop) {
        // If target has changed its top
        const prevAnnotationEl = annotationEls[i - 1]

        // Set the normal top for our annotation
        let currentTop = targetTop - containerTop

        if (prevAnnotationEl) {
          const { top: prevAnnotationTop, height: prevHeight } = prevAnnotationEl.el.getBoundingClientRect()

          // If our normal top is smaller than the previous annotation takes space
          const isOverlappingPrev = currentTop <= (prevAnnotationTop + prevHeight - containerTop)

          if (isOverlappingPrev) {
            overlappingCount++
            // We position our annotation below the previous one
            currentTop = currentTop + (prevHeight) * overlappingCount + ANNOTATION_GAP * overlappingCount
          } else {
            overlappingCount = 0
          }
        }

        el.style.top = `${currentTop}px`
        annotationEls[i].prevTargetTop = targetTop
      }
    })
    frameId = requestAnimationFrame(trackTopChange)
  }

  useEffect(() => {
    setFilteredAnnotations(panelState.annotations
      .filter(a => !!document.getElementById(panelId).querySelector(a.target[0].selector.value)))
  }, [panelState])

  useEffect(() => {
    if (mountedCount > 0 && mountedCount === filteredAnnotations.length) {
      console.log('All items are now mounted in the DOM')

      trackTopChange()
    }
    return () => cancelAnimationFrame(frameId)
  }, [mountedCount, filteredAnnotations.length])

  return <div className="relative border-t border-border bg-accent flex-1 p-2">
    { filteredAnnotations.map(a => <Annotation data={a} key={a.id} onMount={handleChildMount} />)}
  </div>
}

export default AnnotationsBody
