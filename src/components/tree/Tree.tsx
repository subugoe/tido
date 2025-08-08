import { FC } from 'react'

import TreeNode from '@/components/tree/TreeNode'

interface TreeProps {
  nodes: TreeNode[]
}

const Tree: FC<TreeProps> = ({ nodes }) => {
  const tree =
    nodes?.length > 0 &&
    nodes.map((collection) => (
      <TreeNode node={collection} />
    ))

  return <div className="tree" data-cy="tree">
    {tree}
  </div>
}

export default Tree
