import { FC } from 'react'

import TreeNode from '@/components/tree/TreeNode'

interface TreeProps {
  nodes: TreeNode[]
  showQuickView?: boolean
}

const Tree: FC<TreeProps> = ({ nodes, showQuickView = false }) => {
  const tree =
    nodes?.length > 0 &&
    nodes.map((collection, i) => <TreeNode node={collection} key={collection.key + '_'+i} showQuickView={showQuickView} />)

  return <div className="tree pr-0.5" data-cy="tree">
    {tree}
  </div>
}

export default Tree
