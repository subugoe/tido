
import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'

interface AnnotationTypeProps {
  type: string
}

const AnnotationType: FC<AnnotationTypeProps> = ({ type }) => {
  const { selectedAnnotationTypes, setSelectedAnnotationTypes, panelState, setFilteredAnnotations } = usePanel()
  const [selected, setSelected] = useState(true)

  function onAnnotationTypeSelect() {
    // updateSelectedTypes
    const newAnnotationTypes = selected ? selectedAnnotationTypes.filter(a => a !== type) : [...selectedAnnotationTypes, type]
    setSelectedAnnotationTypes(newAnnotationTypes)

    setSelected(!selected)

    // update filteredAnnotations
    const textEl = document.querySelector('div[data-text-container]')
    const newFilteredAnnotations = getFilteredAnnotations(textEl, panelState.annotations, newAnnotationTypes)
    setFilteredAnnotations(newFilteredAnnotations)
  }



  function getFilteredAnnotations(textEl: Element, annotations: Annotation[], newAnnotationTypes: string[]) {
    return  annotations.filter((a) =>
      Array.from(textEl.querySelectorAll(a.target[0].selector.value)).length > 0
         && newAnnotationTypes.includes(a.body['x-content-type']))
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
