import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'

const ANNOTATION_GAP = 5

const AnnotationsBody: FC = () => {
  const { panelState, panelId, annotationSelectors } = usePanel()
  const [mountedCount, setMountedCount] = useState(0)
  const [elements, setElements] = useState([])
  const [filteredAnnotations, setFilteredAnnotations] = useState([])

  const [textContainer] = useState(document.getElementById(panelId).querySelector(`[data-text-container]`) as HTMLElement)
  const [selected, setSelected] = useState(null)
  const [yMap, setYMap] = useState({})

  const ref = useRef()
  const handleChildMount = (target: HTMLElement, el: HTMLElement, annotation) => {
    setMountedCount(prev => prev + 1)
    elements.push({
      target,
      el,
      desiredY: target.offsetTop,
      annotation
    })
    setElements(elements)
  }

  const handleAnnotationClick = (el: HTMLElement, a: Annotation) => {
    elements.forEach(({ el }) => el.removeAttribute('data-selected'))
    el.setAttribute('data-selected', 'true')
    setSelected(a)
  }

  useEffect(() => {
    trackTopChange()
  }, [selected])

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

      if (selected && annotationEl.annotation.id === selected.id && actualY !== annotationEl.desiredY) {
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
    let resizeObserver
    if (mountedCount > 0 && mountedCount === filteredAnnotations.length) {
      resizeObserver = new ResizeObserver(entries => {
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
    if (annotationSelectors.length === 0) {
      setFilteredAnnotations([])
      setMountedCount(0)
    } else {
      setFilteredAnnotations(panelState.annotations
        .filter(a => !!document.getElementById(panelId).querySelector(a.target[0].selector.value)))
    }

    return () => {
      if (ref.current) ref.current.style.opacity = 0
      setElements([])
      setMountedCount(0)
    }
  }, [annotationSelectors])

  return <div ref={ref} className="transition-opacity opacity-0">
    {filteredAnnotations.map(a => <Annotation
      data={a}
      key={a.id}
      onMount={handleChildMount}
      onClick={handleAnnotationClick}
      selected={selected && a.id === selected.id}
      top={yMap[a.id]}
    />)}
  </div>
}

export default AnnotationsBody
