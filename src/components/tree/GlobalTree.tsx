import { FC } from 'react'
import { dataStore } from '@/store/DataStore.tsx'


import { TreeProvider } from '@/contexts/TreeContext.tsx'

import TreeNode from '@/components/tree/TreeNode.tsx'


const GlobalTree: FC = () => {

  const nodes = dataStore(state => state.treeNodes)


  const tree =
    nodes.length > 0 &&
    nodes.map((collection, i) => (
      <div key={i}>
        <TreeNode node={collection}/>
      </div>
    ))


  return <div className="tree t-h-96 t-overflow-hidden t-overflow-y-auto">
    <TreeProvider onSelect={onSelect} onExpand={onExpand} onCollapse={onCollapse}>
      {tree}
    </TreeProvider>
  </div>
}

export default GlobalTree
