import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  data: Annotation
}

const Annotation: FC<Props> = ({ data }) => {
  const { panelId } = usePanel()
  const ref = useRef(null)
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)
  const [top, setTop] = useState(3)
  let prevTop = null
  let containerTop = 0
  let frameId = null
  function trackTopChange() {
    const { top } = target.getBoundingClientRect()
    if (top !== prevTop) {
      const prevAnnotationEl = ref?.current.previousElementSibling
      let currentTop = 0
      if (prevAnnotationEl) {
        const { top: prevAnnotationTop, height: prevHeight } = prevAnnotationEl.getBoundingClientRect()
        currentTop = top - containerTop
        const isOverlappingPrev = currentTop <= (prevAnnotationTop + prevHeight - containerTop)
        console.log(prevAnnotationEl, isOverlappingPrev, currentTop, prevAnnotationTop, prevHeight, containerTop)
      }

      setTop(currentTop)
      prevTop = top
    }
    frameId = requestAnimationFrame(trackTopChange)
  }

  useEffect(() => {
    if (target) {
      const rect = target.getBoundingClientRect()
      const textContainer = document.getElementById(panelId).querySelector(`[data-panel="${panelId}"]`)
      const textRect = textContainer.getBoundingClientRect()
      containerTop = textRect.top
      setTop(rect.top - containerTop)
      trackTopChange()
    }
    return () => cancelAnimationFrame(frameId)
  }, [target])

  return <>
    <div
      ref={ref}
      className="absolute flex-flex-col bg-background p-2 border border-border rounded-md shadow-sm"
      style={{
        ...top > -1 && { top },
      }}
    >
      { typeof data.body.value === 'string' ? <span>{ data.body.value }</span> : '' }
    </div>
  </>
}

export default Annotation
