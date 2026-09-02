import { FC, useEffect, useRef, useState } from 'react'

import { useDataStore } from '@/store/DataStore.tsx'
import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'
import GlobalTreeSelectionModalContent from '@/components/tree/tree-modal/GlobalTreeSelectionModalContent.tsx'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover.tsx'
import { getChildren, getExpandedNode } from '@/utils/tree.ts'

interface GlobalTreeProps {
  open?: boolean
}

const GlobalTree: FC<GlobalTreeProps> = ({ open = true }) => {

  const selectedNode = useRef<TreeNode>(null)

  // we define the way to show nodes in Global tree using "treeNodes"
  const [treeNodes, setTreeNodes] = useState([])
  const nodes = useDataStore(state => state.treeNodes)

  const [showSelectionModal, setShowSelectionModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 })

  function onSelectNode(node: TreeNode, target: HTMLElement) {
    selectedNode.current = node

    const rect = target.getBoundingClientRect()
    setSelectedPosition({ x: rect.left, y: rect.top })
    setShowSelectionModal(true)
  }

  useEffect(() => {
    const loadNodes = async (nodes: TreeNode[]) => {
      try {
        const treeNodes = nodes.length > 1 ? nodes : nodes.length === 1 ? [await getExpandedNode(nodes[0])] : []
        setTreeNodes(treeNodes)
      } catch {
        console.error('error while loading data in Global tree')
      }
    }
    loadNodes(nodes)
  }, [nodes])

  return <div className={`${open ? 'opacity-100 visible' : 'opacity-0 invisible'} flex-1 flex transition-all duration-300 overflow-hidden`}>
    <div className="shrink-0 overflow-auto [scrollbar-gutter:stable] flex-1 min-w-0">
      <TreeProvider onSelect={onSelectNode} getChildren={getChildren} elevation={1}>
        <Tree nodes={treeNodes} showQuickView />
        {showSelectionModal && (
          <Popover
            open={showSelectionModal}
            onOpenChange={(isOpen) => setShowSelectionModal(isOpen)}
          >
            <PopoverAnchor
              style={{ position: 'fixed', top: selectedPosition.y, left: selectedPosition.x }}
            />
            <PopoverContent
              side="right"
              align="start"
              sideOffset={8}
              className="w-auto p-1.5"
              data-cy="global-tree-modal"
            >
              <GlobalTreeSelectionModalContent node={selectedNode.current}
                onSelect={() => setShowSelectionModal(false)} />
            </PopoverContent>
          </Popover>
        )}
      </TreeProvider>
    </div>
  </div>

}

export default GlobalTree
