import { FC, useEffect, useRef, useState } from 'react'

import { configStore } from '@/store/ConfigStore'
import { dataStore } from '@/store/DataStore'


import TreeView from '@/components/Tree.tsx'
import InputField from '@/components/base/InputField.tsx'
import { ClosePopover } from '@/components/ui/popover'
import { createTree, getItemIndices, getManifestIndices, getChildren } from '@/utils/tree'
import { getUniquePanels } from '@/utils/panel'
import { validateUrlInput } from '@/utils/treeModal.ts'


const ContentModal: FC = () => {

  const panels = configStore(state => state.config.panels)
  const addNewPanel = configStore(state => state.addNewPanel)

  const initTreeNodes = dataStore(state => state.initTreeNodes)
  const updateTreeNodes = dataStore(state => state.updateTreeNodes)
  const nodes = dataStore(state => state.treeNodes)

  const [uniquePanels] = useState(getUniquePanels(panels))


  const inputValue = useRef('')
  const clickedItemUrl = useRef('')

  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1,
  })


  useEffect(() => {
    async function initTree(panels?: PanelConfig[]) {
      if (!panels) return

      const nodes = await createTree(panels)
      initTreeNodes(nodes)
    }

    initTree(uniquePanels)
  }, [uniquePanels])


  function updateInputValue(newValue: string) {
    inputValue.current = newValue
  }

  async function handleSelectClick() {

    let collectionUrl: string | undefined

    if (clickedItemUrl.current) {
      // transfer the clicked item indices
      const { collectionUrl, manifestIndex, itemIndex } = selectedItemIndices.current
      addNewPanel({
        entrypoint: {
          url: collectionUrl,
          type: 'collection',
        },
        manifestIndex: manifestIndex,
        itemIndex: itemIndex
      })
    }

    if (inputValue.current !== '') {
      collectionUrl = inputValue.current
      // should display an error
      const isValid = await validateUrlInput(collectionUrl)

      if (!isValid) {
        console.error('Please provide a valid URL value for the new collection')
        return
      }

      addNewPanel(
        {
          entrypoint: {
            url: collectionUrl,
            type: 'collection',
          },
          manifestIndex: 0,
          itemIndex: 0
        }
      )
    }
  }


  async function onExpand(node: TreeNode) {
    const { type } = node
    const updatedTree = [...nodes]

    if (type === 'collection') {
      const collectionIndex = nodes.findIndex((n) => (n.id === node.id))
      if (!('children' in updatedTree[collectionIndex])) updatedTree[collectionIndex]['children'] = await getChildren(node)

      updatedTree[collectionIndex].expanded = true

    } else if (type === 'manifest') {
      const { collectionIndex, manifestIndex } = getManifestIndices(node.key)
      const manifestNode = { ...updatedTree[collectionIndex].children[manifestIndex] }

      if (!('children' in manifestNode)) manifestNode['children'] = await getChildren(node)

      updatedTree[collectionIndex].children[manifestIndex] = { ...manifestNode }
      updatedTree[collectionIndex].children[manifestIndex].expanded = true
    }

    updateTreeNodes(updatedTree)
  }

  async function onCollapse(node: TreeNode) {
    const { type } = node
    const updatedTree = [...nodes]

    if (type === 'collection') {
      const collectionIndex = nodes.findIndex((n) => (n.id === node.id))
      updatedTree[collectionIndex].expanded = false
    } else if (type === 'manifest') {
      const { collectionIndex, manifestIndex } = getManifestIndices(node.key)

      updatedTree[collectionIndex].children[manifestIndex].expanded = false
    }

    updateTreeNodes(updatedTree)
  }

  function onSelect(node: TreeNode) {
    const { id } = node
    clickedItemUrl.current = id
    selectedItemIndices.current = getItemIndices(node.key, nodes)
  }


  return <div
    className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-[500px] t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">

    <span className="t-font-bold">Enter a Collection Url</span>
    <InputField updateInputValue={updateInputValue}/>
    <span>Or choose:</span>

    <TreeView nodes={nodes} onSelect={onSelect} onExpand={onExpand} onCollapse={onCollapse}/>

    <div className="t-pb-4">
      <ClosePopover
        className='t-bg-blue-500 t-text-white t-rounded t-flex t-text-center t-pl-2 t-ml-[80%] t-mt-10 t-items-center t-justify-items-center t-w-16 t-h-10'
        onClick={() => handleSelectClick()}>
        Select
      </ClosePopover>
    </div>
  </div>
}

//

export default ContentModal
