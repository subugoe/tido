import { FC } from 'react'


import { TreeProvider } from '@/contexts/TreeContext.tsx'

import TreeNode from '@/components/tree/TreeNode'

interface TreeProps {
  nodes: TreeNode[],

  onSelect(node: TreeNode): void,

  onExpand(node: TreeNode): void,

  onCollapse(node: TreeNode): void,
}

const Tree: FC<TreeProps> = ({ nodes, onSelect, onExpand, onCollapse }) => {


  const tree =
    nodes.length > 0 &&
    nodes.map((collection, i) => (
      <div
        key={i}
        className=""
      >
        <TreeNode node={collection}/>
      </div>
    ))


  return <div className="tree t-h-96 t-overflow-hidden t-overflow-y-auto">
    <TreeProvider onSelect={onSelect} onExpand={onExpand} onCollapse={onCollapse}>
      {tree}
    </TreeProvider>
  </div>
}

export default Tree
