import { FC, useRef } from 'react'

import { useDataStore } from '@/store/DataStore'
import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'

import { getChildren, getSelectedItemIndices } from '@/utils/tree.ts'
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
  const treeNodes = useDataStore(state => state.treeNodes)
  const clickedItemUrl = useRef('')

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
  }


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
    >
      { t('confirm') }
    </Button>
  </div>
}


export default TreeSelection
