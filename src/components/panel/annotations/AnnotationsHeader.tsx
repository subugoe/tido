
import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'

const AnnotationsHeader: FC = () => {

  const { panelState, annotationTypes, setAnnotationTypes } = usePanel()

  useEffect(() => {
    // get annotations which are related to text
    const textEl = document.querySelector('div[data-text-container]')
    const filteredAnnotations = panelState.annotations.filter((a) =>
      Array.from(textEl.querySelectorAll(a.target[0].selector.value)).length > 0)

    const contentTypes = filteredAnnotations.map(item => item.body['x-content-type'])
    setAnnotationTypes([...new Set(contentTypes)])
  }, [panelState.annotations])

  if (annotationTypes.length > 0) return (
    <div data-cy="annotations-header" className="flex mt-4 gap-2">
      { annotationTypes.map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
    </div>
  )
}

export default AnnotationsHeader
