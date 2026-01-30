import { FC, useEffect, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import Annotation from '@/components/panel/annotations/Annotation.tsx'

import { getFilteredAnnotations } from '@/utils/annotations.ts'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'


const AnnotationsList: FC = () => {

  const { matchedAnnotationsMap, selectedAnnotation } = usePanel()
  const filteredAnnotations = getFilteredAnnotations(matchedAnnotationsMap)
  const annotationsListRef = useRef(null)

  useEffect(() => {
    if (!annotationsListRef.current || !selectedAnnotation) return
    const scrollableContainer: HTMLElement = annotationsListRef.current.parentElement as HTMLElement
    const selectedAnnotationEl = (annotationsListRef.current as HTMLElement).querySelector(`div[data-annotation="${selectedAnnotation.id}"]`) as HTMLElement
    scrollIntoViewIfNeeded(selectedAnnotationEl, scrollableContainer)
  }, [selectedAnnotation])


  if (filteredAnnotations.length > 0) return <div ref={annotationsListRef} className={`transition-opacity pt-4`}>
    {filteredAnnotations.map(a => <Annotation
      data={a}
      key={a.id}
    />)}
  </div>
}

export default AnnotationsList
