import { FC, useRef, MouseEvent, useState } from 'react'

import { useTree } from '@/contexts/TreeContext'


interface TreeNodeProps {
    node: TreeNode,
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {

  const [hasChildren, setHasChildren] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { onClick, getChildren } = useTree()

  const itemRef = useRef(null)

  async function handleNodeClick(e: MouseEvent<HTMLElement>) {
    e.preventDefault()

    if (!hasChildren) {
      node.children = [...await getChildren(node)]
      setHasChildren(true)
    }

    if (node.children.length > 0) {
      toggleExpand()
      return
    }
    onClick(node, e.target)
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
          <TreeNode node={item}/>
        </ul>
      ))}
    </div>

  return <div ref={itemRef}
    className="t-mb-1 t-py-[2px] t-px-2 hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-rounded-md"
    onClick={(e) => handleNodeClick(e)}>{node.label}</div>
}

export default TreeNode
