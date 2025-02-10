import { FC, useRef, useState } from 'react'

import { dataStore } from '@/store/DataStore.tsx'

import Tree from '@/components/Tree.tsx'
import Modal from '@/components/Modal.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree-modal/GlobalTreeSelectionModalContent.tsx'

import { getChildren, getNodeIndices } from '@/utils/tree.ts'

const GlobalTree: FC = () => {

  const showGlobalTree = dataStore(state => state.showGlobalTree)

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


  return showGlobalTree && <div className="t-ml-10 t-w-92 t-mt-4 t-pt-4 t-border-r-2 t-border-gray-200">
    <Tree nodes={treeNodes} onSelect={onSelectNode} getChildren={getChildren}/>
    <Modal showPopover={showSelectionModal} position={positionSelectedItem}>
      <GlobalTreeSelectionModalContent selectedItemIndices={selectedItemIndices.current}/>
    </Modal>
  </div>
}

export default GlobalTree
