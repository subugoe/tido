import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { updateNodeSelection } from '@/utils/filter-tree.ts'
import { FC, useCallback, useState } from 'react'
import { AnnotationFiltersConfig, FilterNode } from '@/types'

interface Props {
  config: AnnotationFiltersConfig
  onChange?: (items: FilterNode[]) => void
}

const MultipleRootFilter: FC<Props> = ({ config, onChange }) => {
  const [items, setItems] = useState<FilterNode[]>(() =>
    JSON.parse(JSON.stringify(config.items))
  )

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
