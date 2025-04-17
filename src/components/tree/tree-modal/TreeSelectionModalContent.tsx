import { FC, useRef } from 'react'

import { useConfigStore } from '@/store/ConfigStore'
import { useDataStore } from '@/store/DataStore'


import Tree from '@/components/tree/Tree.tsx'
import InputField from '@/components/base/InputField.tsx'

import { getChildren, getSelectedItemIndices, createCollectionNode } from '@/utils/tree.ts'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'

interface Props {
  onConfirm?: () => void
}

const TreeSelectionModalContent: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation()
  const addNewPanel = useConfigStore(state => state.addNewPanel)
  const initCollection = useDataStore(state => state.initCollection)
  const treeNodes = useDataStore(state => state.treeNodes)
  const inputValue = useRef('')
  const clickedItemUrl = useRef('')

  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1,
  })

  function updateInputValue(newValue: string) {
    inputValue.current = newValue
  }

  async function handleConfirm() {

    let collectionUrl: string | undefined

    if (clickedItemUrl.current) {
      // transfer the clicked item indices
      const { collectionUrl, manifestIndex, itemIndex } = selectedItemIndices.current
      addNewPanel({
        collection: collectionUrl,
        manifestIndex: manifestIndex,
        itemIndex: itemIndex
      })
    }

    if (inputValue.current !== '') {
      collectionUrl = inputValue.current

      addNewPanel(
        {
          collection: collectionUrl,
          manifestIndex: 0,
          itemIndex: 0
        }
      )

      if (!(useConfigStore.getState().config.rootCollections.includes(collectionUrl))) {
        const newRootNode = await createCollectionNode(collectionUrl)
        useDataStore.getState().appendRootNode(newRootNode)
        useConfigStore.getState().addRootCollection(collectionUrl)
      }

      await initCollection(collectionUrl)
    }

    if (onConfirm) onConfirm()
  }


  function onSelect(node: TreeNode) {
    const { id } = node
    clickedItemUrl.current = id
    selectedItemIndices.current = getSelectedItemIndices(node)
  }


  return <div className="t-flex t-flex-col">
    <span className="t-font-bold t-mb-2">{ t('enter_collection_url') }</span>
    <InputField width={80} updateInputValue={updateInputValue} />
    <span>{ t('or_choose') }:</span>

    <div className="t-max-h-80 t-overflow-y-auto">
      <Tree nodes={treeNodes} onSelect={onSelect} getChildren={getChildren} />
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


export default TreeSelectionModalContent
