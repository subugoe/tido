import { FC, useEffect, useRef } from 'react'

import { configStore } from '@/store/ConfigStore'
import { dataStore } from '@/store/DataStore'


import Tree from '@/components/Tree.tsx'
import InputField from '@/components/base/InputField.tsx'
import { ClosePopover } from '@/components/ui/popover'
import { createTree, getChildren, getNodeIndices } from '@/utils/tree'


const TreeSelectionModalContent: FC = () => {

  const addNewPanel = configStore(state => state.addNewPanel)

  const setTreeNodes = dataStore(state => state.setTreeNodes)
  const initCollection = dataStore(state => state.initCollection)
  const collections = dataStore(state => state.collections)
  const nodes = dataStore(state => state.treeNodes)


  const inputValue = useRef('')
  const clickedItemUrl = useRef('')

  const selectedItemIndices = useRef({
    collectionUrl: '',
    manifestIndex: -1,
    itemIndex: -1,
  })


  useEffect(() => {
    async function initTree(collections: CollectionMap) {

      const collectionsUrls = Object.keys(collections)
      if (collectionsUrls.length === 0) return

      const nodes = await createTree(collectionsUrls)
      setTreeNodes(nodes)
    }

    initTree(collections)
  }, [collections])


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

      await initCollection(collectionUrl)
    }
  }


  async function onExpand(node: TreeNode) {
    const { type } = node
    const updatedTree = [...nodes]

    if (type === 'collection') {
      const [collectionIndex] = getNodeIndices(node.key)
      if (!('children' in updatedTree[collectionIndex])) {
        const childrenNodes = await getChildren(node)
        if (childrenNodes.length === 0) return

        updatedTree[collectionIndex].children = childrenNodes
      }

      updatedTree[collectionIndex].expanded = true

    } else if (type === 'manifest') {
      const [collectionIndex, manifestIndex] = getNodeIndices(node.key)
      const manifests = updatedTree[collectionIndex].children
      if (!manifests) return
      if (manifests.length === 0) return

      const manifestChildren = await getChildren(node)
      if (manifestChildren.length === 0) return
      manifests[manifestIndex].children = manifestChildren
      manifests[manifestIndex].expanded = true

      updatedTree[collectionIndex].children = [...manifests]
    }

    setTreeNodes(updatedTree)
  }

  async function onCollapse(node: TreeNode) {
    const { type } = node
    const updatedTree = [...nodes]

    if (type === 'collection') {
      const [collectionIndex] = getNodeIndices(node.key)
      updatedTree[collectionIndex].expanded = false
    } else if (type === 'manifest') {
      const [collectionIndex, manifestIndex] = getNodeIndices(node.key)

      const manifests = updatedTree[collectionIndex].children
      if (!manifests) return
      manifests[manifestIndex].expanded = false

      updatedTree[collectionIndex].children = [...manifests]
    }

    setTreeNodes(updatedTree)
  }

  function onSelect(node: TreeNode) {
    const { id } = node
    clickedItemUrl.current = id
    const [collectionIndex, manifestIndex, itemIndex] = getNodeIndices(node.key)
    const collectionUrl = nodes[collectionIndex].id
    selectedItemIndices.current = { collectionUrl: collectionUrl, manifestIndex: manifestIndex, itemIndex: itemIndex }
  }


  return <div
    className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-[500px] t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">

    <span className="t-font-bold">Enter a Collection Url</span>
    <InputField updateInputValue={updateInputValue}/>
    <span>Or choose:</span>

    <Tree nodes={nodes} onSelect={onSelect} onExpand={onExpand} onCollapse={onCollapse}/>

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
