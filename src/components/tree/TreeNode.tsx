import { FC, MouseEvent, useState } from 'react'

import { useTree } from '@/contexts/TreeContext'
import { ChevronRight } from 'lucide-react'


interface TreeNodeProps {
  node: TreeNode,
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {

  const [hasChildren, setHasChildren] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { onSelect, getChildren, selectedNodeId, setSelectedNodeId } = useTree()

  async function handleNodeClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault()

    if (!hasChildren) {
      node.children = [...await getChildren(node)]
      if (node.children.length > 0) setHasChildren(true)
    }

    if (node.children.length > 0) {
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
    <div
      data-cy="tree-node"
      className={`flex items-center px-2 py-1 rounded-md hover:cursor-pointer ${ selectedNodeId === node.id ? 'shadow-sm bg-muted border border-border' : 'hover:bg-muted' }`}
      onClick={(e) => handleNodeClick(e)}
    >
      {!node.leaf && <span className={`mt-[2px] mr-1 transition-all ${isExpanded && 'rotate-90'}`}><ChevronRight /></span>}
      <span className={`${node.leaf ? 'ml-4': ''}`}>{node.label}</span>
    </div>
    {hasChildren && isExpanded && node.children?.map((item: TreeNode, i) => (
      <ul data-cy="tree-node-child" className="ml-3" key={i}>
        <TreeNode node={item} />
      </ul>
    ))}
  </div>
}

export default TreeNode
