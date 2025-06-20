import { FC, useEffect, useRef, useState } from 'react'

import { useDataStore } from '@/store/DataStore'
import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'

import { getChildren, getExpandedNode, getSelectedItemIndices } from '@/utils/tree.ts'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

interface Props {
  onConfirm?: () => void
}

const TreeSelection: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation()
  const addPanel = usePanelStore(state => state.addPanel)
  const nodes = useDataStore(state => state.treeNodes)
  // we define the way to show nodes in Global tree using "treeNodes"
  const [treeNodes, setTreeNodes] = useState([])
  const clickedItemUrl = useRef('')
  const [confirmActive, setConfirmActive] = useState(false)

  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1,
  })

  async function handleConfirm() {
    if (clickedItemUrl.current) {
      // transfer the clicked item indices
      const { collectionUrl, manifestIndex, itemIndex } = selectedItemIndices.current
      const newPanelId = crypto.randomUUID()
      useUIStore.getState().updateNewestPanelId(newPanelId)
      addPanel({
        collection: collectionUrl,
        manifestIndex: manifestIndex,
        itemIndex: itemIndex
      }, newPanelId)
    }

    if (onConfirm) onConfirm()
  }


  function onSelect(node: TreeNode) {
    const { id } = node
    clickedItemUrl.current = id
    selectedItemIndices.current = getSelectedItemIndices(node)
    setConfirmActive(true)
  }

  useEffect(() => {
    // for now we define same loadNodes in every container which displays tree.
    // Later we can customize the initial display based on the requirements
    const loadNodes = async (nodes) => {
      const treeNodes = nodes.length > 1 ? nodes : nodes.length === 1 ? [await getExpandedNode(nodes[0])] : []
      setTreeNodes(treeNodes)
    }

    loadNodes(nodes)
  }, [nodes])


  return <div className="flex flex-col">
    <div className="max-h-80 overflow-y-auto">
      <TreeProvider onSelect={onSelect} getChildren={getChildren}>
        <Tree nodes={treeNodes} />
      </TreeProvider>
    </div>
    <Button
      variant="default"
      onClick={handleConfirm}
      className="mt-6"
      disabled={!confirmActive}
    >
      { t('confirm') }
    </Button>
  </div>
}


export default TreeSelection
