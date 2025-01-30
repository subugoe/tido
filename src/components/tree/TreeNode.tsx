import { FC, useRef } from 'react'

import { useTree } from '@/contexts/TreeContext'


interface TreeNodeProps {
  node: TreeNode,
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {

  const { onClick } = useTree()

  const itemRef = useRef(null)

  function handleNodeClick() {
    onClick(node)
    // add class t-bg-primary
  }


  if ('children' in node && node.expanded)
    return <div>
      <div className="t-mb-1 t-py-[2px] t-px-2 hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-round-md"
           onClick={() => handleNodeClick()}> {node.label}</div>
      {node.children?.map((item: TreeNode, i) => (
        <ul className="t-ml-2" key={i}>
          <TreeNode node={item}/>
        </ul>
      ))}
    </div>

  return <div ref={itemRef}
              className="t-mb-1 t-py-[2px] t-px-2 hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-rounded-md"
              onClick={() => handleNodeClick()}>{node.label}</div>
}

export default TreeNode
