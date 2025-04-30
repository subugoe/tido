import { FC, useEffect, useRef, useState } from 'react'

import { useDataStore } from '@/store/DataStore.tsx'
import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree/tree-modal/GlobalTreeSelectionModalContent.tsx'
import { getChildren, getSelectedItemIndices } from '@/utils/tree.ts'

const GlobalTree: FC = () => {

  const showGlobalTree = useDataStore(state => state.showGlobalTree)
  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1
  })

  const treeNodes = useDataStore(state => state.treeNodes)
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

  return <div className={`${showGlobalTree ? 't-w-[380px]' : 't-w-[0px]'} t-flex t-transition-all t-mt-4 t-mb-4`}>
    <div className={`t-flex-shrink-0 t-overflow-auto t-transition-all t-border-r-2 t-pr-4
    t-mr-[16px] t-w-[364px] ${showGlobalTree ? 't-duration-300 t-opacity-100 ' : 't-duration-100 t-opacity-0'}`}>
      <TreeProvider onSelect={onSelectNode} getChildren={getChildren}>
        <Tree nodes={treeNodes} />
        {showSelectionModal && <div
          ref={modalRef}
          className="t-fixed t-z-50 t-p-2 t-bg-white t-border t-border-gray-200 t-shadow-md t-rounded"
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
