import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'

interface AnnotationTypeProps {
  type: string
}

const AnnotationType: FC<AnnotationTypeProps> = ({ type }) => {
  const { fullAnnotationTypes, setFullAnnotationTypes, matchedAnnotationsMap, setMatchedAnnotationsMap } = usePanel()
  const selected = fullAnnotationTypes[type]

  function onSelect() {
    const newAnnotationTypes = { ...fullAnnotationTypes }
    newAnnotationTypes[type] = !selected

    const matchedAnnotationsMapofClickedType = Object.fromEntries(
      Object.entries(matchedAnnotationsMap).filter(([, value]) => value.annotation.body['x-content-type'] === type)
    )
    const annotationIdsOfClickedType = Object.keys(matchedAnnotationsMapofClickedType)

    const matchedAnnotationsMapOnSelect = { ...matchedAnnotationsMap }
    Object.keys(matchedAnnotationsMapOnSelect).forEach((key) => {
      if (annotationIdsOfClickedType.includes(key)) matchedAnnotationsMapOnSelect[key].filtered = !selected
    })

    setMatchedAnnotationsMap(matchedAnnotationsMapOnSelect)
    setFullAnnotationTypes(newAnnotationTypes)
  }


  return (
    <Button
      onClick={() => onSelect()}
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
