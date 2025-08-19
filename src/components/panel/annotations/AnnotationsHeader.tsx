
import  { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'

const AnnotationsHeader: FC = () => {

  const { fullAnnotationTypes, matchedAnnotationsMap, panelState } = usePanel()
  const textAnnotations = panelState.annotations.filter(a => Object.keys(matchedAnnotationsMap).includes(a.id))
  const [visibleAnnotationTypes, setVisibleAnnotationTypes] = useState<AnnotationTypesDict>({})

  useEffect(() => {
    if (Object.keys(fullAnnotationTypes).length > 0) {
      const uniqueAnnotTypes: string[] = [... new Set(textAnnotations.map((a) => a.body['x-content-type']))]
      const annotTypes: AnnotationTypesDict = Object.fromEntries(
        uniqueAnnotTypes.map(key => [key, fullAnnotationTypes[key]])
      )
      setVisibleAnnotationTypes(annotTypes)
    }
  }, [matchedAnnotationsMap])



  if (Object.keys(visibleAnnotationTypes).length > 0) return (
    <div data-cy="annotations-header" className="flex flex-col items-center">
      <div data-cy="annotation-types" className="flex gap-2 flex-wrap">
        { Object.keys(visibleAnnotationTypes).map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
      </div>
    </div>
  )
}

export default AnnotationsHeader
