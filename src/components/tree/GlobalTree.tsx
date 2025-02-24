import { FC, useRef, useState } from 'react'
import { dataStore } from '@/store/DataStore.tsx'
import Tree from '@/components/tree/Tree.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree/tree-modal/GlobalTreeSelectionModalContent.tsx'
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
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 })

  function onSelectNode(node: TreeNode, target: HTMLElement) {
    const [collectionIndex, manifestIndex, itemIndex] = getNodeIndices(node.key)
    const collectionUrl = treeNodes[collectionIndex].id
    selectedItemIndices.current = { collectionUrl: collectionUrl, manifestIndex: manifestIndex, itemIndex: itemIndex }

    // when we click at another item, show the modal
    setShowSelectionModal(true)
    setSelectedPosition(target.getBoundingClientRect())
  }

  return showGlobalTree && <div className="t-flex-shrink-0 t-w-[380px] t-mt-4 t-mr-4 t-pr-4 t-border-r-2 t-border-gray-200 t-overflow-auto">
    <Tree nodes={treeNodes} onSelect={onSelectNode} getChildren={getChildren} />
    { showSelectionModal && <div
      className="t-fixed t-z-50 t-p-2 t-bg-white t-border t-border-gray-200 t-shadow-md t-rounded"
      style={{
        top: `${selectedPosition?.y + 40}px`,
        left: `${selectedPosition?.x}px`,
      }}
    >
      <GlobalTreeSelectionModalContent selectedItemIndices={selectedItemIndices.current} onSelect={() => setShowSelectionModal(false)} />
    </div> }
  </div>
}

export default GlobalTree
