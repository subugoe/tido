
import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import AnnotationType from '@/components/panel/annotations/AnnotationType.tsx'

const AnnotationsHeader: FC = () => {

  const { filteredAnnotations } = usePanel()

  const [annotationTypes, setAnnotationTypes] = useState([])

  useEffect(() => {
    const contentTypes = filteredAnnotations.map(item => item.body['x-content-type'])
    const uniqueContentTypes = [...new Set(contentTypes)]
    setAnnotationTypes(uniqueContentTypes)
  }, [filteredAnnotations])


  return (
    <div data-cy="annotations-header" className="flex mt-4 gap-2">
      {annotationTypes.length > 0 && annotationTypes.map((type: string, i) => <AnnotationType type={type} key={'annotation-type-' +i} />)}
    </div>

  )
}

export default AnnotationsHeader
