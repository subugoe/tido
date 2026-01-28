import { FC, useCallback, useState } from 'react'
import { FilterNode } from '@/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  node: FilterNode
  path: number[]
  onToggle: (path: number[]) => void
  depth?: number
}

const FilterTreeNode: FC<Props> = ({ node, path, onToggle, depth = 0 }) => {
  const { usePanelTranslation } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { t } = usePanelTranslation()

  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = node.items && node.items.length > 0

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
    <div className={depth > 0 ? 'ml-4' : ''}>
      <div className="flex items-center gap-2 py-1.5 rounded px-2 group transition-colors hover:bg-muted cursor-pointer">
        {hasChildren && (
          <button
            onClick={toggleExpand}
            className="p-1 hover:bg-accent rounded-lg cursor-pointer"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        {!hasChildren && depth > 0 && <div className="w-6" />}
        <label className="flex items-center gap-2 flex-1 cursor-pointer">
          <input
            type="checkbox"
            checked={node.selected}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 accent-primary focus:ring-primary/20"
          />
          <span className="text-sm">{label}</span>
          {node.types && node.types.length > 1 &&
            <span className={`text-sm text-gray-500 italic`}>
              &nbsp; ({node.types.map(type => t(getTypeLabel(type))).join(', ')})
            </span>}
        </label>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4.5 mb-2 border-l-2 border-border">
          {node.items!.map((child, index) => (
            <FilterTreeNode
              key={index}
              node={child}
              path={[...path, index]}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterTreeNode
