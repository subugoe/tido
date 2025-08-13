
import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'

interface AnnotationTypeProps {
  type: string
}

const AnnotationType: FC<AnnotationTypeProps> = ({ type }) => {
  const { annotationTypes, setAnnotationTypes, panelState, setFilteredAnnotations } = usePanel()
  const selected = annotationTypes[type]

  function onAnnotationTypeSelect() {
    // updateSelectedTypes
    const newAnnotationTypes = { ...annotationTypes }
    newAnnotationTypes[type] = !selected
    console.log('new annotation types on annot select', newAnnotationTypes)
    setAnnotationTypes(newAnnotationTypes)

    // update filteredAnnotations
    const selectedAnnotationTypes = Object.keys(newAnnotationTypes).filter((type) => newAnnotationTypes[type] === true)
    const textEl = document.querySelector('div[data-text-container]')
    const newFilteredAnnotations = getFilteredAnnotations(textEl, panelState.annotations, selectedAnnotationTypes)
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
