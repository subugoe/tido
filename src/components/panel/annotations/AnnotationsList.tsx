import { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'
import AnnotationListItem from "@/components/panel/annotations/AnnotationListItem.tsx";

const ANNOTATION_GAP = 5

const AnnotationsBody: FC = () => {
  const { panelId, filteredAnnotations, selectedAnnotation } = usePanel()
  const [elements, setElements] = useState([])

  const [textContainer] = useState(document.getElementById(panelId).querySelector(`[data-text-container]`) as HTMLElement)
  const [loading, setLoading] = useState(false)

  const ref = useRef()

  useEffect(() => {
  }, [selectedAnnotation])


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
    setLoading(false)
  }, [elements])

  return <div ref={ref} className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
    {filteredAnnotations.map(a => <AnnotationListItem
      data={a}
      key={a.id}
    />)}
  </div>
}

export default AnnotationsBody
