import { FC, useEffect } from 'react'
import { dataStore } from '@/store/DataStore.tsx'

import { getTreeNodes, onExpand, onCollapse } from '@/utils/tree.ts'
import Tree from '@/components/Tree.tsx'


const GlobalTree: FC = () => {

  const collections = dataStore(state => state.collections)

  const treeNodes = dataStore(state => state.treeNodes)
  const setTreeNodes = dataStore(state => state.setTreeNodes)


  async function onExpandNode(node: TreeNode, nodes: TreeNode[]) {
    const updatedTree = await onExpand(node, nodes)
    if (!updatedTree) return

    setTreeNodes(updatedTree)
  }

  async function onCollapseNode(node: TreeNode, nodes: TreeNode[]) {
    const updatedTree = await onCollapse(node, nodes)
    if (!updatedTree) return

    setTreeNodes(updatedTree)
  }

  useEffect(() => {

    async function initTree() {
      const nodes = await getTreeNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree()
  }, [collections])


  return <div className="t-ml-4 t-mt-40">

    <Tree nodes={treeNodes} onExpand={onExpandNode} onCollapse={onCollapseNode}/>

  </div>
}

export default GlobalTree
