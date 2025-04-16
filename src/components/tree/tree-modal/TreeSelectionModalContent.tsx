import { FC, useRef } from 'react'

import { useConfigStore } from '@/store/ConfigStore'
import { useDataStore } from '@/store/DataStore'


import Tree from '@/components/tree/Tree.tsx'
import InputField from '@/components/base/InputField.tsx'
import { ClosePopover } from '@/components/ui/popover'

import { getChildren, getSelectedItemIndices, appendRootNodeInTree } from '@/utils/tree.ts'


const TreeSelectionModalContent: FC = () => {
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

  async function handleSelectClick() {

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

      // if new collection url not in the rootNodes - append it in rootNodes
      if (!(useConfigStore.getState().config.rootCollections.includes(collectionUrl))) appendRootNodeInTree(collectionUrl)
      await initCollection(collectionUrl)
    }

  }


  function onSelect(node: TreeNode) {
    const { id } = node
    clickedItemUrl.current = id
    selectedItemIndices.current = getSelectedItemIndices(node)
  }


  return <div className="t-flex t-flex-col t-w-[380px]">
    <span className="t-font-bold t-mb-2">Enter a collection URL</span>
    <InputField width={80} updateInputValue={updateInputValue} />
    <span>Or choose:</span>

    <div className="t-max-h-80 t-overflow-y-auto">
      <Tree nodes={treeNodes} onSelect={onSelect} getChildren={getChildren} />
    </div>

    <div className="t-pb-4">
      <ClosePopover
        className='t-bg-blue-500 t-text-white t-rounded t-flex t-text-center t-pl-2 t-ml-[80%] t-mt-10 t-items-center t-justify-items-center t-w-16 t-h-10'
        onClick={() => handleSelectClick()}>
        Select
      </ClosePopover>
    </div>
  </div>
}


export default TreeSelectionModalContent
