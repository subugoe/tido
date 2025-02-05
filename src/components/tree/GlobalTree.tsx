import { FC, useRef, useState } from 'react'

import { dataStore } from '@/store/DataStore.tsx'

import Tree from '@/components/Tree.tsx'
import TreeSelectionModal from '@/components/TreeSelectionModal.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree-modal/GlobalTreeSelectionModalContent.tsx'

import { onExpand, onCollapse, getNodeIndices } from '@/utils/tree.ts'

const GlobalTree: FC = () => {

  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1
  })

  const treeNodes = dataStore(state => state.treeNodes)

  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [positionSelectedItem, setPositionSelectedItem] = useState({ x: 0, y: 0 })


  function onSelectNode(node: TreeNode, target) {
    const [collectionIndex, manifestIndex, itemIndex] = getNodeIndices(node.key)
    const collectionUrl = treeNodes[collectionIndex].id
    selectedItemIndices.current = { collectionUrl: collectionUrl, manifestIndex: manifestIndex, itemIndex: itemIndex }

    const { x, y } = target.getBoundingClientRect()
    setShowSelectionModal(true)
    setPositionSelectedItem({ x: x, y: y })
  }

  return <div className="t-ml-16 t-mt-24">
    <Tree nodes={treeNodes} onSelect={onSelectNode} onExpand={onExpand} onCollapse={onCollapse}/>
    <TreeSelectionModal showPopover={showSelectionModal} setShowSelectionModal={setShowSelectionModal}
      Content={<GlobalTreeSelectionModalContent selectedItemIndices={selectedItemIndices.current}/>}
      position={positionSelectedItem}/>
  </div>
}

export default GlobalTree
