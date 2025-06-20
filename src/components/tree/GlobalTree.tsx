import { FC, useEffect, useRef, useState } from 'react'

import { useDataStore } from '@/store/DataStore.tsx'
import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree/tree-modal/GlobalTreeSelectionModalContent.tsx'
import { getChildren, getExpandedNode, getSelectedItemIndices } from '@/utils/tree.ts'

const GlobalTree: FC = () => {

  const showGlobalTree = useDataStore(state => state.showGlobalTree)
  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1
  })

  // we define the way to show nodes in Global tree using "treeNodes"
  const [treeNodes, setTreeNodes] = useState([])
  const nodes = useDataStore(state => state.treeNodes)

  const modalRef = useRef<HTMLDivElement>(null)
  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 })

  function onSelectNode(node: TreeNode, target: HTMLElement) {
    selectedItemIndices.current = getSelectedItemIndices(node)

    // when we click at another item, show the modal
    setShowSelectionModal(true)
    setSelectedPosition(target.getBoundingClientRect())
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowSelectionModal(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const loadNodes = async (nodes) => {
      const treeNodes = nodes.length > 1 ? nodes : nodes.length === 1 ? [await getExpandedNode(nodes[0])] : []
      setTreeNodes(treeNodes)
    }

    loadNodes(nodes)
  }, [nodes])

  return <div className={`${showGlobalTree ? 'w-[380px]' : 'w-[0px]'} flex bg-background transition-all py-4`}>
    <div className={`shrink-0 overflow-auto transition-all border-r-2 border-border pr-4
    mr-[16px] w-[364px] ${showGlobalTree ? 'duration-300 opacity-100 ' : 'duration-100 opacity-0'}`}>
      <TreeProvider onSelect={onSelectNode} getChildren={getChildren}>
        <Tree nodes={treeNodes} />
        {showSelectionModal && <div
          ref={modalRef}
          className="fixed z-50 p-2 bg-popover border border-border shadow-md rounded"
          style={{
            top: `${selectedPosition?.y + 40}px`,
            left: `${selectedPosition?.x}px`,
          }}
          data-cy="global-tree-modal"
        >
          <GlobalTreeSelectionModalContent selectedItemIndices={selectedItemIndices.current}
            onSelect={() => setShowSelectionModal(false)} />
        </div>}
      </TreeProvider>
    </div>
  </div>

}

export default GlobalTree
