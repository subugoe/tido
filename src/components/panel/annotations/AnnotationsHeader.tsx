
import { FC, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'
import AnnotationFilterDropdown from '@/components/panel/annotations/AnnotationFilterDropdown.tsx'

const AnnotationsHeader: FC = () => {

  const { panelState, annotationTypes, setAnnotationTypes } = usePanel()

  function getUpdatedAnnotationTypes(contentTypes, oldAnnotationTypes: object) {
    const newAnnotationTypes = {}
    contentTypes.map((type) => {
      if (type in oldAnnotationTypes) newAnnotationTypes[type] = oldAnnotationTypes[type]
      else newAnnotationTypes[type] = true
    })
    return newAnnotationTypes
  }

  useEffect(() => {
    // get annotations which are related to text
    const textEl = document.querySelector('div[data-text-container]')
    const filteredAnnotations = panelState.annotations.filter((a) =>
      Array.from(textEl.querySelectorAll(a.target[0].selector.value)).length > 0)

    const contentTypes = filteredAnnotations.map(item => item.body['x-content-type'])
    const newAnnotationTypes = getUpdatedAnnotationTypes(contentTypes, annotationTypes)
    console.log('new annotatoin types', newAnnotationTypes)
    setAnnotationTypes(newAnnotationTypes)
  }, [panelState.annotations])

  if (Object.keys(annotationTypes).length > 0) return (
    <div data-cy="annotations-header" className="flex flex-col items-center">
      <div data-cy="annotation-types" className="flex gap-2 flex-wrap">
        { Object.keys(annotationTypes).map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
      </div>
      <div className="flex justify-center annotation-filter-dropdown">
        {annotationTypes['Variant'] === true && <AnnotationFilterDropdown type='Variant' />}
      </div>
    </div>
  )
}

export default AnnotationsHeader
