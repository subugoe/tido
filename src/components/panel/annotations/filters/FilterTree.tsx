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

  const anyChildren = nodes.some((node) => node.items && node.items.length > 0)

  if (nodes.length === 0) {
    return <div className="h-16 px-3 text-sm text-muted-foreground flex justify-center items-center">{ t('no_annotation_filters') }</div>
  }

  return <div className="-ml-6">
    {
      nodes.map((node, index) => (
        <FilterTreeNode
          key={index}
          node={node}
          path={[index]}
          onToggle={onToggle}
          indented={anyChildren && !(node.items && node.items.length > 0)} // only intend if some sibling has children but this node does not
        />
      ))
    }
  </div>


}

export default FilterTree
