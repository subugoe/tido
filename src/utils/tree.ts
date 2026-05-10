import { request } from '@/utils/http'
import { useDataStore } from '@/store/DataStore.tsx'
import { isCollectionUrl, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { apiRequest } from '@/utils/api.ts'
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

  const response = await request<Collection>(url)
  if (!response.success) return null

  node.key = url
  node.id = url
  node.type = 'collection'
  node.label = response.data.titles[0] || ''

  return node
}


async function getChildren(node: TreeNode): Promise<TreeNode[]> {
  const { id } = node
  const parentKey = node.key

  let data: Collection | Manifest

  if (!isCollectionUrl(id) && !isManifestUrl(id)) throw new CustomError('Error in TextAPI '+node.type , 'Id "'+ id +'" is provided incorrectly')

  if (isCollectionUrl(id)) {
    // If parent node is a collection, we initialize it like all collections, so it becomes available for panel loading
    data = await useDataStore.getState().initCollection(id)
  } else if (isManifestUrl(id)) {
    const response = await request<Manifest>(id)
    if (!response.success) throw new CustomError('Error '+(response as ErrorResponse).code, (response as ErrorResponse).message)
    data = response.data
  }

  // Handle both Collection (manifests) and Manifest (items)
  // Both are now string arrays (IDs)
  let sequenceKey

  if ('collections' in data) sequenceKey = 'collections'
  else if ('manifests' in data)  sequenceKey = 'manifests'
  else if ('items' in data)  sequenceKey = 'items'

  if (!sequenceKey) return []

  const sequence =
    data[sequenceKey as keyof typeof data] as Collection[] | Manifest[] | Item[] | string[] | undefined
  if (!sequence) return []

  const idsAndLabels = sequence.map(item => {

    let id
    let label

    if (typeof item === 'object') {
      id = item.id
      if (item.textapiType === 'TextApiCollection') label = item.titles[0]
      else if (item.textapiType === 'TextApiManifest') label = item.label
      else if (item.textapiType === 'TextApiItem') label = item.division
    } else {
      id = item
      label = id.split('/').pop()
    }


    return { id, label }
  })

  if (!idsAndLabels || idsAndLabels.length === 0) return []

  // For both Collections and Manifests, the IDs are strings
  return idsAndLabels.map(({ id, label }) => {
    let type = ''

    if (isCollectionUrl(id)) type = 'collection'
    else if (isManifestUrl(id)) type = 'manifest'
    else if (isItemUrl(id)) type = 'item'

    return {
      id,
      type,
      label,
      key: parentKey + NODE_KEY_DELIMITER + id,
      leaf: type === 'item',
      expanded: false,
      children: [] as TreeNode[]
    }
  })
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
      const child = await apiRequest<Collection>(id)
      await getChildrenCollectionIds(child)
    }
  }

  await getChildrenCollectionIds(rootCollection)
  return Array.from(result)
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
  const collection = ids[ids.length - 3]
  const manifest = ids[ids.length - 2]
  const item = ids[ids.length - 1]

  return { collection, manifest, item }
}

async function getExpandedNode(node: TreeNode): Promise<TreeNode> {
  node.children = [...await getChildren(node)]
  if (node.children.length > 0) node.expanded = true
  return node
}

export {  createCollectionNode, createCollectionNodes, getChildren,
  getNodeIndices, getPanelConfigFromNode, getCollectionSlug, getExpandedNode, getRootChildrenCollectionsIds
}
