import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  data: Annotation
  onMount: (target: HTMLElement, el: HTMLElement) => void
}

const Annotation: FC<Props> = React.memo(({ data, onMount }) => {
  const { panelId } = usePanel()
  const ref = useRef(null)
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)
  const [top, setTop] = useState(0)
  const prevTop = null
  const containerTop = 0
  const frameId = null
  // function trackTopChange() {
  //   const { top } = target.getBoundingClientRect()
  //   if (top !== prevTop) {
  //     const prevAnnotationEl = ref?.current.previousElementSibling
  //     let currentTop = 0
  //     if (prevAnnotationEl) {
  //       const { top: prevAnnotationTop, height: prevHeight } = prevAnnotationEl.getBoundingClientRect()
  //       currentTop = top - containerTop
  //       const isOverlappingPrev = currentTop <= (prevAnnotationTop + prevHeight - containerTop)
  //       console.log(prevAnnotationEl.style.top)
  //     }
  //
  //     setTop(currentTop)
  //     prevTop = top
  //   }
  //   frameId = requestAnimationFrame(trackTopChange)
  // }

  useEffect(() => {
    onMount(target, ref.current)
  }, [])

  // useEffect(() => {
  //   if (target) {
  //     const rect = target.getBoundingClientRect()
  //     const textContainer = document.getElementById(panelId).querySelector(`[data-panel="${panelId}"]`)
  //     const textRect = textContainer.getBoundingClientRect()
  //     containerTop = textRect.top
  //     setTop(rect.top - containerTop)
  //     trackTopChange()
  //   }
  //   return () => cancelAnimationFrame(frameId)
  // }, [target])

  return <>
    <div
      ref={ref}
      className="absolute flex-flex-col bg-background p-2 border border-border rounded-md shadow-sm w-4/5"
      // style={{
      //   ...top > -1 && { top },
      // }}
    >
      { typeof data.body.value === 'string' ? <span>{ data.body.value }</span> : '' }
    </div>
  </>
})

export default Annotation
