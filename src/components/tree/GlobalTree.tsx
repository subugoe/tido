import { FC, useRef, useState } from 'react'

import { dataStore } from '@/store/DataStore.tsx'

import Tree from '@/components/Tree.tsx'
import Modal from '@/components/Modal.tsx'
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

    // when we click at another item, show the modal
    setShowSelectionModal(true)
    setPositionSelectedItem(target.getBoundingClientRect())
  }

  return <div className="t-ml-16 t-mt-24">
    <Tree nodes={treeNodes} onSelect={onSelectNode} onExpand={onExpand} onCollapse={onCollapse}/>
    <Modal showPopover={showSelectionModal}
      Content={<GlobalTreeSelectionModalContent selectedItemIndices={selectedItemIndices.current}/>}
      position={positionSelectedItem}/>
  </div>
}

export default GlobalTree
