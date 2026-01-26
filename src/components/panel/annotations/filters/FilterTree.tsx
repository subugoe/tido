import { FC } from 'react'
import { FilterNode } from '@/types'
import FilterTreeNode from '@/components/panel/annotations/filters/FilterTreeNode.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  nodes: FilterNode[]
  onToggle: (path: number[]) => void
}

const FilterTree: FC<Props> = ({ nodes, onToggle }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  if (nodes.length === 0) {
    return <div className="h-16 text-muted-foreground flex justify-center items-center">{ t('no_annotation_filters') }</div>
  }

  return nodes.map((node, index) => (
    <FilterTreeNode
      key={index}
      node={node}
      path={[index]}
      onToggle={onToggle}
      depth={0}
    />
  ))
}

export default FilterTree
