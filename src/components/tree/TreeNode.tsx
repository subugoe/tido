import { FC, MouseEvent, useState } from 'react'
import { useTree } from '@/contexts/TreeContext'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Folder, LibraryBig, File, FolderOpen } from 'lucide-react'

import EmptyNode from '@/components/tree/EmptyNode.tsx'


interface TreeNodeProps {
  node: TreeNode,
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {
  const { onSelect, getChildren, selectedNodeId, setSelectedNodeId } = useTree()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(node.expanded)
  const [showEmptyNode, setShowEmptyNode] = useState(false)

  async function handleNodeClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault()

    if (!node.expanded && !node.leaf) node.children = [...await getChildren(node)]

    if (node.children.length > 0) {
      toggleExpand()
      return
    }

    // the node has no children and it is not a leaf node, so we should return
    if (node.type !== 'item') {
      setShowEmptyNode(true)
      toggleExpand()
      return
    }

    onSelect(node, e.target as HTMLElement)
    setSelectedNodeId(node.id)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return <div className="mb-1">
    <div data-cy="tree-node" data-node-key={node.key}>
      <div
        className={`flex items-start px-2 py-1 rounded-md cursor-pointer ${ selectedNodeId === node.id ? 'bg-muted border border-border active' : 'hover:bg-accent' }`}
        onClick={(e) => handleNodeClick(e)}
      >
        {!node.leaf && <span className={`mt-1 transition-all ${isExpanded && 'rotate-90'}`}><ChevronRight size={18} /></span>}
        <div className={`shrink-0 mt-1 mx-2 ${node.leaf ? 'ml-5': ''}`}>
          { node.type === 'collection' && <LibraryBig size={18} />}
          { node.type === 'manifest' && !isExpanded && <Folder size={18} />}
          { node.type === 'manifest' && isExpanded && <FolderOpen size={18} />}
          { node.type === 'item' && <File size={18} />}
        </div>
        <span data-cy="node-label">{node.label}</span>
      </div>
      <div className="flex-col" data-cy="node-children">
        { isExpanded && node.children?.map((item: TreeNode, i) => (
          <ul data-cy="tree-node-child" className="ml-3" key={i}>
            <TreeNode node={item} />
          </ul>
        ))}
      </div>
      {showEmptyNode && isExpanded && <EmptyNode label={t('no_items_found')} />}
    </div>
  </div>
}

export default TreeNode
