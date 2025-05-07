import { FC, useRef } from 'react'

import { useDataStore } from '@/store/DataStore'
import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'

import { getChildren, getSelectedItemIndices } from '@/utils/tree.ts'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'
import { usePanelStore } from '@/store/PanelStore.tsx'

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
      addPanel({
        collection: collectionUrl,
        manifestIndex: manifestIndex,
        itemIndex: itemIndex
      })
    }

    if (onConfirm) onConfirm()
  }


  function onSelect(node: TreeNode) {
    const { id } = node
    clickedItemUrl.current = id
    selectedItemIndices.current = getSelectedItemIndices(node)
  }


  return <div className="t-flex t-flex-col">
    <div className="t-max-h-80 t-overflow-y-auto">
      <TreeProvider onSelect={onSelect} getChildren={getChildren}>
        <Tree nodes={treeNodes} />
      </TreeProvider>
    </div>
    <Button
      variant="default"
      onClick={handleConfirm}
      className="t-mt-6"
    >
      { t('confirm') }
    </Button>
  </div>
}


export default TreeSelection
