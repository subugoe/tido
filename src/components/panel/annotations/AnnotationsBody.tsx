import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'

const ANNOTATION_GAP = 5

const AnnotationsBody: FC = () => {
  const { panelId, filteredAnnotations, selectedAnnotation } = usePanel()
  const [elements, setElements] = useState([])

  const [textContainer] = useState(document.getElementById(panelId).querySelector(`[data-text-container]`) as HTMLElement)
  const [yMap, setYMap] = useState({})
  const [loading, setLoading] = useState(false)

  const ref = useRef()

  useEffect(() => {
    if (selectedAnnotation) trackTopChange()
  }, [selectedAnnotation])


  function trackTopChange() {
    if (elements.length === 0) return

    // Set the desiredY according to current target positions
    for (let i = 0; i < elements.length; i++) {
      elements[i].desiredY = elements[i].target.getBoundingClientRect().top - textContainer.getBoundingClientRect().top
    }

    elements.sort((a, b) => a.desiredY - b.desiredY)
    for (let i = 0; i < elements.length; i++) {
      const annotationEl = elements[i]
      const lastHeight = i === 0 ? 0 : elements[i - 1].el.offsetHeight
      const lastY = i === 0 ? 0 : elements[i - 1].desiredY
      const minY = lastY + lastHeight + ANNOTATION_GAP

      const actualY = i === 0 ? annotationEl.desiredY : Math.max(annotationEl.desiredY, minY)

      if (selectedAnnotation && annotationEl.annotation.id === selectedAnnotation.id && actualY !== annotationEl.desiredY) {
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
    if (filteredAnnotations.length === 0) {
      setElements([])
    } else {
      const annotationEls = Array.from(ref.current.childNodes)
      const _elements = annotationEls.map(el => {
        const annotation = filteredAnnotations.find(a => a.id === el.getAttribute('data-annotation'))
        if (!annotation) return
        const target = document.getElementById(panelId).querySelector(annotation.target[0].selector.value)
        return {
          target,
          el,
          desiredY: target.offsetTop,
          annotation
        }
      })

      setElements(_elements)
    }

    return () => {
      setLoading(true)
      setElements([])
    }
  }, [filteredAnnotations])

  useEffect(() => {
    let resizeObserver
    let timeout
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

  return <div ref={ref} className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
    {filteredAnnotations.map(a => <Annotation
      data={a}
      key={a.id}
      top={yMap[a.id]}
    />)}
  </div>
}

export default AnnotationsBody
