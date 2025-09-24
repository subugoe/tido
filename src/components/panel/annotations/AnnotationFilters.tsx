import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationTypes from '@/components/panel/annotations/AnnotationTypes.tsx'
import WitnessFilter from '@/components/panel/annotations/WitnessFilter.tsx'

const AnnotationFilters: FC = () => {
  const [visibleAnnotationTypes, setVisibleAnnotationTypes] = useState<AnnotationTypesDict>({})
  const { fullAnnotationTypes, matchedAnnotationsMap, panelState } = usePanel()
  const textAnnotations = panelState.annotations?.length > 0 ? panelState.annotations.filter(a => Object.keys(matchedAnnotationsMap).includes(a.id)) : []

  useEffect(() => {
    if (!fullAnnotationTypes) return
    if (Object.keys(fullAnnotationTypes).length === 0) return
    if (textAnnotations.length === 0) {
      setVisibleAnnotationTypes([])
      return
    }
    const uniqueAnnotationTypes: string[] = [... new Set(textAnnotations.map((a) => a.body['x-content-type']))]
    const annotationTypes: AnnotationTypesDict = Object.fromEntries(
      uniqueAnnotationTypes.map(key => [key, fullAnnotationTypes[key]])
    )
    setVisibleAnnotationTypes(annotationTypes)
  }, [matchedAnnotationsMap])

  function isVisibleType(type: string) {
    return visibleAnnotationTypes[type] ?? false
  }

  return <div className="flex flex-col items-center w-100 mt-4">
    <AnnotationTypes typesMap={visibleAnnotationTypes} />
    { isVisibleType('Variant') && <div className="mt-1"><WitnessFilter /></div> }
  </div>
}

export default AnnotationFilters
