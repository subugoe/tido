
import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface AnnotationTypeProps {
  type: string
}

const AnnotationType: FC<AnnotationTypeProps> = ({ type }) => {
  const { selectedAnnotationTypes, setSelectedAnnotationTypes } = usePanel()
  const [selected, setSelected] = useState(true)

  function updateSelected() {
    if (selected) setSelectedAnnotationTypes(selectedAnnotationTypes.filter(a => a !== type))
    if (!selected) setSelectedAnnotationTypes([...selectedAnnotationTypes, type])
    setSelected(!selected)
  }
  useEffect(() => {
  }, [])


  return (
    <div
      data-cy="annotation-type"
      className={`w-fit rounded cursor-pointer px-1 py-0.5 ${selected ?  'bg-white text-black' : 'bg-black text-white'}`}
      onClick={() => updateSelected()}>
      {type}
    </div>
  )
}

export default AnnotationType
