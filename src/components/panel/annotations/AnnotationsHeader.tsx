
import  { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'
import AnnotationFilterDropdown from '@/components/panel/annotations/AnnotationFilterDropdown.tsx'

const AnnotationsHeader: FC = () => {

  const annotations = usePanel().panelState.annotations
  const { annotationTypes, matchedAnnotationsMap } = usePanel()     // global annotation types
  const [annotTypes, setAnnotTypes] = useState({})                  // annot types corresponding with highlighted targets

  useEffect(() => {
    // filter annot Types from annotationTypes of panel based on annotations which have target on text
    const matchedAnnotationsIds = Object.keys(matchedAnnotationsMap)
    const newAnnotTypes = []
    annotations.map((a) => {
      if (matchedAnnotationsIds.includes(a.id)) newAnnotTypes.push(a.body['x-content-type'])
    })
    const uniqueAnnotTypesAsArray = [...new Set(newAnnotTypes)]
    const newAnnotTypesObj = Object.fromEntries(
      Object.entries(annotationTypes).filter(([key]) => uniqueAnnotTypesAsArray.includes(key))
    )

    setAnnotTypes(newAnnotTypesObj)
  }, [matchedAnnotationsMap])



  if (Object.keys(annotTypes).length > 0) return (
    <div data-cy="annotations-header" className="flex flex-col items-center">
      <div data-cy="annotation-types" className="flex gap-2 flex-wrap">
        { Object.keys(annotTypes).map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
      </div>
      <div className="flex justify-center annotation-filter-dropdown">
        {annotTypes['Variant'] === true && <AnnotationFilterDropdown type='Variant' />}
      </div>
    </div>
  )
}

export default AnnotationsHeader
