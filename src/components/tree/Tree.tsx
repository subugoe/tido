import { FC } from 'react'

import TreeNode from '@/components/tree/TreeNode'

interface TreeProps {
  nodes: TreeNode[]
}

const Tree: FC<TreeProps> = ({ nodes }) => {
  const tree =
    nodes?.length > 0 &&
    nodes.map((collection, i) => (
      <div key={i}>
        <TreeNode node={collection} />
      </div>
    ))

  return <div className="tree">
    {tree}
  </div>
}

export default Tree
