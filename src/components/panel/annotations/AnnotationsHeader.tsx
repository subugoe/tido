
import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

const AnnotationsHeader: FC = () => {

  const { filteredAnnotations } = usePanel()

  const [annotationTypes, setAnnotationTypes] = useState([])
  const [selectedAnnotationType, setSelectedAnnotationType] = useState('')

  useEffect(() => {
    const contentTypes = filteredAnnotations.map(item => item.body['x-content-type'])
    const uniqueContentTypes = [...new Set(contentTypes)]
    setAnnotationTypes(uniqueContentTypes)
  }, [filteredAnnotations])

  function updateSelectedAnnotationType (newAnnotationType) {
    setSelectedAnnotationType(newAnnotationType)
  }

  return (
    <div data-cy="annotations-header" className="flex mt-4 gap-2">
      {annotationTypes.length > 0 && annotationTypes.map((type: string, i) =>
        <div
          key={i}
          className={`w-fit rounded cursor-pointer px-1 py-0.5 ${selectedAnnotationType === type  ?  'bg-white text-black' : 'bg-black text-white'}`}
          onClick={(e) => updateSelectedAnnotationType(e.currentTarget.innerHTML)}>
          {type}
        </div>)}
    </div>

  )
}

export default AnnotationsHeader
