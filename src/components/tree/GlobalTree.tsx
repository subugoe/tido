import { FC, useEffect, useState } from 'react'
import { dataStore } from '@/store/DataStore.tsx'

import { getTreeNodes, onExpand, onCollapse } from '@/utils/tree.ts'
import Tree from '@/components/Tree.tsx'
import TreeSelectionModal from '@/components/TreeSelectionModal.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree-modal/GlobalTreeSelectionModalContent.tsx'


const GlobalTree: FC = () => {

  const collections = dataStore(state => state.collections)

  const treeNodes = dataStore(state => state.treeNodes)
  const setTreeNodes = dataStore(state => state.setTreeNodes)

  const [showSelectionModal, setShowSelectionModal] = useState(false)

  const [positionSelectedItem, setPositionSelectedItem] = useState({ x: 0, y: 0 })


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

  function onSelectNode(node: TreeNode, e) {
    const { x, y } = e.target.getBoundingClientRect()
    console.log('clicked x', x)
    console.log('clicked y', y)
    setPositionSelectedItem({ x: x, y: y })
    setShowSelectionModal(true)
  }

  useEffect(() => {

    async function initTree() {
      const nodes = await getTreeNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree()
  }, [collections])


  return <div className="t-ml-16 t-mt-24">

    <Tree nodes={treeNodes} onSelect={onSelectNode} onExpand={onExpandNode} onCollapse={onCollapseNode}/>
    <TreeSelectionModal Content={GlobalTreeSelectionModalContent} position={positionSelectedItem}/>

  </div>
}

export default GlobalTree
