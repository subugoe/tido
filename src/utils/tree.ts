import { useDataStore } from '@/store/DataStore.tsx'
import { hasManifests, isCollectionUrl, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { PanelConfig } from '@/types'
import { NODE_KEY_DELIMITER } from './constants'

async function createCollectionNodes(rootIds: string[]): Promise<TreeNode[]> {
  const nodes: TreeNode[] = []

  for (let i = 0; i < rootIds.length; i++) {
    await createCollectionNode(rootIds[i]).then((node) => {
      if (!node) return
      nodes.push(node as TreeNode)
    })
  }

  return nodes
}

async function createCollectionNode(url: string) {
  const node: TreeNode = { key: '', id: '', type: '', label: '', children: [] }

  const collection = await useDataStore.getState().initCollection(url)

  node.key = url
  node.id = url
  node.type = 'collection'
  node.label = collection.titles?.length > 0 && collection.titles[0] || ''

  return node
}


async function getChildren(node: TreeNode, showItemLevel = true): Promise<TreeNode[]> {
  const { id } = node
  const parentKey = node.key

  let data: Collection | Manifest

  // The node type wins over url sniffing: DTS resource urls are collection endpoints and do
  // not match the TextAPI url patterns.
  if (node.type === 'manifest') {
    data = await useDataStore.getState().initManifest(id)
  } else if (node.type === 'collection' || isCollectionUrl(id)) {
    // If parent node is a collection, we initialize it like all collections, so it becomes available for panel loading
    data = await useDataStore.getState().initCollection(id)
  } else if (isManifestUrl(id)) {
    data = await useDataStore.getState().initManifest(id)
  } else {
    throw new CustomError('Error in TextAPI ' + node.type, 'Id "' + id + '" is provided incorrectly')
  }

  // Collections can mix sub-collections and manifests (DTS), so concatenate all sequences.
  const members: (Collection | Manifest | MinimalResource | Item | string)[] = []

  if ('collections' in data && Array.isArray(data.collections)) members.push(...data.collections)
  if ('manifests' in data && Array.isArray(data.manifests)) members.push(...data.manifests)
  if ('items' in data && Array.isArray(data.items)) members.push(...data.items)

  if (members.length === 0) return []

  const nodes = members.map(item => {
    let id
    let label
    let type = ''

    if (typeof item === 'object') {
      id = item.id
      // MinimalResource members carry no textapi type, so guard the access for them
      const memberType = 'textapiType' in item ? item.textapiType : undefined
      if (memberType === 'TextApiCollection') type = 'collection'
      else if (memberType === 'TextApiManifest') type = 'manifest'
      else if (memberType === 'TextApiItem') type = 'item'

      if ('shortTitle' in item) label = item.shortTitle
      else if (item.textapiType === 'TextApiCollection') label = item.titles[0]
      else if (item.textapiType === 'TextApiManifest' || item.titles && item.titles.length > 0) label = item.titles?.[0]
      else if (item.textapiType === 'TextApiItem' || (item as Item).division) label = item.division
    } else {
      id = item
      label = id.split('/').filter(Boolean).pop()
    }

    if (!type) {
      if (isCollectionUrl(id)) type = 'collection'
      else if (isManifestUrl(id)) type = 'manifest'
      else if (isItemUrl(id)) type = 'item'
    }

    return {
      id,
      type,
      label: label ?? '',
      key: parentKey + NODE_KEY_DELIMITER + id,
      // without the item level, manifests are the last level and open the panel at their first item
      leaf: type === (showItemLevel ? 'item' : 'manifest'),
      expanded: false,
      children: [] as TreeNode[]
    }
  })

  return nodes
}

async function getRootChildrenCollectionsIds(rootCollection: Collection) {
  const result = new Set<string>()

  async function getChildrenCollectionIds(collection: Collection) {
    // Check manifests for collections
    const collectionIds = (collection.collections || [])
      .map(item => typeof item === 'object' ? item.id : item)

    if (collectionIds.length === 0) {
      result.add(collection.id)
      return
    }

    for (const id of collectionIds) {
      result.add(id)
      const child = await useDataStore.getState().initCollection(id)
      await getChildrenCollectionIds(child)
    }
  }

  await getChildrenCollectionIds(rootCollection)
  return Array.from(result)
}

// Panels can only be opened with a leaf collection (one holding manifests). Descend depth-first through
// nested collections and return the id of the first leaf collection, or null if there is none.
async function getFirstLeafCollectionId(collectionId: string): Promise<string | null> {
  const collection = await useDataStore.getState().initCollection(collectionId)
  if (hasManifests(collection)) return collection.id

  for (const child of collection.collections ?? []) {
    const childId = typeof child === 'object' ? child.id : child
    if (!isCollectionUrl(childId)) continue

    const leafId = await getFirstLeafCollectionId(childId)
    if (leafId) return leafId
  }

  return null
}

function getCollectionSlug(id: string) {
  const urlParts = id.split('/')
  const markerIndex = urlParts.findIndex(part => part === 'collections')

  if (markerIndex === -1 || urlParts.length <= markerIndex) return null
  return urlParts[markerIndex + 1].split('.')[0]
}

function getNodeIndices(nodeKey: string) {
  return nodeKey.split(NODE_KEY_DELIMITER)
}

function getPanelConfigFromNode(node: TreeNode): PanelConfig {
  const ids = getNodeIndices(node.key)

  if (node.type === 'item') {
    return {
      collection: ids[ids.length - 3],
      manifest: ids[ids.length - 2],
      item: ids[ids.length - 1]
    }
  }

  if (node.type === 'manifest') {
    return {
      collection: ids[ids.length - 2],
      manifest: ids[ids.length - 1]
    }
  }

  return { collection: ids[ids.length - 1] }
}

async function getExpandedNode(node: TreeNode, showItemLevel = true): Promise<TreeNode> {
  node.children = [...await getChildren(node, showItemLevel)]
  if (node.children.length > 0) node.expanded = true
  return node
}

// The top level of a tree. Several root nodes are shown collapsed. A single root node is expanded, or
// without showRootNode hidden, so that its children are the top level.
async function getTopLevelNodes(nodes: TreeNode[], showItemLevel = true, showRootNode = false): Promise<TreeNode[]> {
  if (nodes.length !== 1) return nodes

  const rootNode = await getExpandedNode(nodes[0], showItemLevel)
  return showRootNode ? [rootNode] : rootNode.children
}

export {  createCollectionNode, createCollectionNodes, getChildren,
  getNodeIndices, getPanelConfigFromNode, getCollectionSlug, getExpandedNode, getRootChildrenCollectionsIds,
  getFirstLeafCollectionId, getTopLevelNodes
}
