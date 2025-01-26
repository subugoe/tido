import { FC, useEffect } from 'react'


import { TreeProvider } from '@/contexts/TreeContext.tsx'

import TreeNode from '@/components/tree/TreeNode'

interface TreeProps {
  nodes: TreeNode[],
  onClick(node: TreeNode): void,
  onSelect(node: TreeNode): void,
  onExpand(node: TreeNode): void,
  onCollapse(node: TreeNode): void
}
// ({ nodes, onSelect, onExpand })
const Tree: FC<TreeProps> = ({ nodes, onClick, onSelect, onExpand, onCollapse }) => {


  // TODO: function to process a select event: (click on item, manifest or collcetion) - we get it from TreeNode


  const tree =
    nodes.length > 0 &&
    nodes.map((collection, i) => (
      <div
        key={i}
        className=""
      >
        <TreeNode node={collection} />
      </div>
    ))



  return <div className="tree t-h-96 t-overflow-hidden t-overflow-y-auto">
    <TreeProvider onClick={onClick} onSelect={onSelect} onExpand={onExpand} onCollapse={onCollapse}>
      {tree}
    </TreeProvider>
  </div>
}

export default Tree