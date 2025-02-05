import { FC, useEffect, useRef, useState } from 'react'

import { dataStore } from '@/store/DataStore.tsx'

import Tree from '@/components/Tree.tsx'
import TreeSelectionModal from '@/components/TreeSelectionModal.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree-modal/GlobalTreeSelectionModalContent.tsx'

import { getTreeNodes, onExpand, onCollapse, getNodeIndices } from '@/utils/tree.ts'


const GlobalTree: FC = () => {

  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1
  })

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
    const [collectionIndex, manifestIndex, itemIndex] = getNodeIndices(node.key)
    const collectionUrl = treeNodes[collectionIndex].id
    selectedItemIndices.current = { collectionUrl: collectionUrl, manifestIndex: manifestIndex, itemIndex: itemIndex }

    const { x, y } = target.getBoundingClientRect()
    setShowSelectionModal(true)
    setPositionSelectedItem({ x: x, y: y })
  }

  useEffect(() => {
    async function initTree(collections: CollectionMap) {
      const nodes = await getTreeNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree(collections)
  }, [collections])


  return <div className="t-ml-16 t-mt-24">

    <Tree nodes={treeNodes} onSelect={onSelectNode} onExpand={onExpandNode} onCollapse={onCollapseNode}/>
    <TreeSelectionModal showPopover={showSelectionModal} setShowSelectionModal={setShowSelectionModal}
      Content={<GlobalTreeSelectionModalContent selectedItemIndices={selectedItemIndices.current}/>}
      position={positionSelectedItem}/>

  </div>
}

export default GlobalTree
