import { FC } from 'react'


import { TreeProvider } from '@/contexts/TreeContext.tsx'

import TreeNode from '@/components/tree/TreeNode'

interface TreeProps {
  nodes: TreeNode[],
  onSelect(node: TreeNode, target: HTMLElement): void,
  getChildren(node: TreeNode): Promise<TreeNode[]>
}

const Tree: FC<TreeProps> = ({ nodes, onSelect, getChildren }) => {
  const tree =
    nodes?.length > 0 &&
    nodes.map((collection, i) => (
      <div key={i}>
        <TreeNode node={collection} />
      </div>
    ))

  return <div className="tree">
    <TreeProvider onSelect={onSelect} getChildren={getChildren}>
      {tree}
    </TreeProvider>
  </div>
}

export default Tree
