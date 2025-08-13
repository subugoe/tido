
import { FC, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'
import AnnotationFilterDropdown from '@/components/panel/annotations/AnnotationFilterDropdown.tsx'

const AnnotationsHeader: FC = () => {

  const { panelState, filteredAnnotations, annotationTypes, setAnnotationTypes } = usePanel()

  function getUpdatedAnnotationTypes(contentTypes, oldAnnotationTypes: object) {
    const newAnnotationTypes = {}
    contentTypes.map((type) => {
      newAnnotationTypes[type] = type in oldAnnotationTypes ? oldAnnotationTypes[type] : true
    })
    return newAnnotationTypes
  }

  useEffect(() => {
    console.log('annotation types', annotationTypes)
    console.log('filtered Annotations', filteredAnnotations)
    const contentTypes = [...Object.keys(annotationTypes), ...filteredAnnotations.map(item => item.body['x-content-type'])]
    const uniqueContentTypes = [...new Set(contentTypes)]
    const newAnnotationTypes = getUpdatedAnnotationTypes(uniqueContentTypes, annotationTypes)
    setAnnotationTypes(newAnnotationTypes)
  }, [filteredAnnotations])

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
