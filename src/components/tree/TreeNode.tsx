import { FC, MouseEvent, useState } from 'react'

import { useTree } from '@/contexts/TreeContext'


interface TreeNodeProps {
  node: TreeNode,
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {

  const [hasChildren, setHasChildren] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { onSelect, getChildren } = useTree()

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
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }


  if (hasChildren && isExpanded)
    return <div>
      <div className="t-mb-1 t-py-[2px] t-px-2 hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-round-md"
        onClick={(e) => handleNodeClick(e)}> {node.label}</div>
      {node.children?.map((item: TreeNode, i) => (
        <ul className="t-ml-2" key={i}>
          <TreeNode node={item} />
        </ul>
      ))}
    </div>

  return <div className="t-mb-1 t-py-[2px] t-px-2 hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-rounded-md"
    onClick={(e) => handleNodeClick(e)}>{node.label}</div>
}

export default TreeNode
