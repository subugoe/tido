
import { FC, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'
import AnnotationFilterDropdown from '@/components/panel/annotations/AnnotationFilterDropdown.tsx'

const AnnotationsHeader: FC = () => {

  const annotations = usePanel().panelState.annotations
  const { annotationTypes, setAnnotationTypes } = usePanel()
  useEffect(() => {
    const newAnnotationTypes = { ...annotationTypes }
    const types = annotations.map((a) => a.body['x-content-type'])
    const uniqueAnnotationTypes = [...new Set(types)]
    if (uniqueAnnotationTypes.length > 0) {
      uniqueAnnotationTypes.forEach((type) => {
        if (!(type in annotationTypes)) newAnnotationTypes[type] = true
      })
    }
    setAnnotationTypes(newAnnotationTypes)
  }, [annotations])

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
