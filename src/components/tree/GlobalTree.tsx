import { FC, useEffect, useState } from 'react'
import { dataStore } from '@/store/DataStore.tsx'

import { getTreeNodes, onExpand, onCollapse } from '@/utils/tree.ts'
import Tree from '@/components/Tree.tsx'
import TreeSelectionModal from '@/components/TreeSelectionModal.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree-modal/GlobalTreeSelectionModalContent.tsx'


const GlobalTree: FC = () => {

  console.log('global tree selection modal content', GlobalTreeSelectionModalContent)

  // as trigger button I need the html element of the item clicked


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

  function onSelectNode(node: TreeNode, target) {
    const { x, y } = target.getBoundingClientRect()
    setShowSelectionModal(true)
    setPositionSelectedItem({ x: x, y: y })

    /*
    setSelectedElement(element)
    */
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
    <TreeSelectionModal showPopover={showSelectionModal} setShowSelectionModal={setShowSelectionModal}
      Content={<GlobalTreeSelectionModalContent/>}
      position={positionSelectedItem}/>

  </div>
}

export default GlobalTree
