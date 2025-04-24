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

    onSelect(node, e.target)
    setSelectedNodeId(node.id)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return <div className="t-mb-1">
    <div
      className={`t-flex t-items-center t-px-2 t-py-1 t-rounded-md hover:t-cursor-pointer ${ selectedNodeId === node.id ? 't-shadow-sm t-border-[2px] t-border-gray-100 t-bg-gray-200' : 'hover:t-bg-gray-100 ' }`}
      onClick={(e) => handleNodeClick(e)}
    >
      {!node.leaf && <span className={`t-mt-[2px] t-mr-1 t-transition-all ${isExpanded && 't-rotate-90'}`}><ChevronRight /></span>}
      <span className={`${node.leaf ? 't-ml-4': ''}`}>{node.label}</span>
    </div>
    {hasChildren && isExpanded && node.children?.map((item: TreeNode, i) => (
      <ul className="t-ml-3" key={i}>
        <TreeNode node={item} />
      </ul>
    ))}
  </div>
}

export default TreeNode
