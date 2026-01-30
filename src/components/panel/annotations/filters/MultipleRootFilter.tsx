import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { updateNodeSelection } from '@/utils/filter-tree.ts'
import { FC, useCallback, useEffect, useState } from 'react'
import { AnnotationFiltersConfig, FilterNode } from '@/types'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  config: AnnotationFiltersConfig
  onChange?: (items: FilterNode[]) => void
}

const MultipleRootFilter: FC<Props> = ({ config, onChange }) => {

  const { annotations: annotationsConfig } = useConfig()
  const {
    annotationFilters,
    matchedAnnotationsMap
  } = usePanel()

  const [items, setItems] = useState<FilterNode[]>(() =>
    JSON.parse(JSON.stringify(config.items))
  )

  useEffect(() => {
    if (annotationsConfig.filters) return

    const uniqueAnnotationTypes: string[] = [
      ...new Set(Object.keys(matchedAnnotationsMap).map((id) => matchedAnnotationsMap[id].annotation.body['x-content-type']))
    ]

    //console.log('unique annotation types', uniqueAnnotationTypes)

    const selectedItems = annotationFilters.items.filter(item =>
      item.types.some(type => uniqueAnnotationTypes.includes(type))
    )

    console.log('selected items', selectedItems)
    setItems(selectedItems)
  },[])



  const handleToggle = useCallback(
    (path: number[]) => {
      const newItems = updateNodeSelection(path, items)
      setItems(newItems)
      onChange?.(newItems)
    },
    [items, onChange]
  )

  return <FilterTree nodes={items} onToggle={handleToggle} />
}

export default MultipleRootFilter
