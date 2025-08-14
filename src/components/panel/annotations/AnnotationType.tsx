
import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'

interface AnnotationTypeProps {
  type: string
}

const AnnotationType: FC<AnnotationTypeProps> = ({ type }) => {
  const { annotationTypes, setAnnotationTypes } = usePanel()
  const selected = annotationTypes[type]

  function onAnnotationTypeSelect() {
    // updateSelectedTypes
    const newAnnotationTypes = { ...annotationTypes }
    newAnnotationTypes[type] = !selected
    setAnnotationTypes(newAnnotationTypes)
  }


  return (
    <Button
      onClick={() => onAnnotationTypeSelect()}
      variant={selected ? 'secondary' : 'ghost'}
      className="w-fit p-2"
      size="icon"
      data-selected={selected}
      data-cy={type}
    >{type}
    </Button>
  )
}

export default AnnotationType
