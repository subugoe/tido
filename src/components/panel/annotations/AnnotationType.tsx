import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'

interface AnnotationTypeProps {
  type: string
}

const AnnotationType: FC<AnnotationTypeProps> = ({ type }) => {
  const { fullAnnotationTypes, setFullAnnotationTypes, matchedAnnotationsMap, setMatchedAnnotationsMap } = usePanel()
  const selected = fullAnnotationTypes[type]
  const annotations = usePanel().panelState.annotations


  function onSelect() {
    const newAnnotationTypes = { ...fullAnnotationTypes }
    newAnnotationTypes[type] = !selected

    const filteredAnnotsIds = annotations.filter(a => a.body['x-content-type'] === type).map(a => a.id)
    const newMatchedAnnotationsMap = getUpdatedMatchedAnnotsMap(matchedAnnotationsMap, filteredAnnotsIds, !selected)

    setMatchedAnnotationsMap(newMatchedAnnotationsMap)
    setFullAnnotationTypes(newAnnotationTypes)
  }


  function getUpdatedMatchedAnnotsMap(matchedAnnotationsMap: MatchedAnnotationsMap, filteredAnnotsIds: string[], newValue: boolean, ): MatchedAnnotationsMap {
    const newMatchedAnnotationsMap = { ...matchedAnnotationsMap }
    Object.keys(newMatchedAnnotationsMap).forEach((key) => {
      if (filteredAnnotsIds.includes(key)) newMatchedAnnotationsMap[key].filtered = newValue
    })
    return newMatchedAnnotationsMap
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
