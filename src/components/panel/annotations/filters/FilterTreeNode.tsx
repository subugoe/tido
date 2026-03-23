import { FC, useCallback, useState } from 'react'
import { FilterNode } from '@/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'

interface Props {
  node: FilterNode
  path: number[]
  onToggle: (path: number[]) => void
  indented?: boolean
}

function hasChildren(node: FilterNode) {
  return node.items && node.items.length > 0
}

const FilterTreeNode: FC<Props> = ({ node, path, onToggle, indented = false }) => {
  const { usePanelTranslation } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { t } = usePanelTranslation()

  const [isExpanded, setIsExpanded] = useState(false)
  const _hasChildren = hasChildren(node)
  const anyGrandChildren = node.items?.some((child) => hasChildren(child))

  const label = node.label ?? node.types?.[0] ?? t('unnamed_filter')

  const handleCheckboxChange = useCallback(() => {
    onToggle(path)
  }, [path, onToggle])

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  function getTypeLabel(type: string) {
    return annotationsConfig.types?.[type]?.label ?? type
  }

  return (
    <div className="ml-6">
      <div className="flex items-center gap-2 py-1.5 rounded px-2 group transition-colors hover:bg-muted cursor-pointer">
        {_hasChildren && (
          <button
            onClick={toggleExpand}
            className="p-1 hover:bg-accent rounded-lg cursor-pointer"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        {indented && <div className="w-6" />}
        <label className="flex items-center gap-2 flex-1 cursor-pointer">
          <Checkbox checked={node.selected} onCheckedChange={handleCheckboxChange} />
          <span className="text-sm">{label}</span>
          {node.types && node.types.length > 1 &&
            <span className={`text-sm text-gray-500 italic`}>
              &nbsp; ({node.types.map(type => t(getTypeLabel(type))).join(', ')})
            </span>}
        </label>
      </div>
      {_hasChildren && isExpanded && (
        <div className="ml-4.5 mb-2 border-l-2 border-border">
          {node.items!.map((child, index) => (
            <FilterTreeNode
              key={index}
              node={child}
              path={[...path, index]}
              onToggle={onToggle}
              indented={anyGrandChildren && !hasChildren(child)} // only intend if some sibling has children but this node does not
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterTreeNode
