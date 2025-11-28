import { request } from '@/utils/http'
import { useDataStore } from '@/store/DataStore.tsx'
import { isCollectionUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { getI18n } from 'react-i18next'
import { apiRequest } from '@/utils/api.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { PanelConfig } from '@/types'

const NODE_KEY_DELIMITER = '>>>>'

async function createCollectionNodes(rootNodes: string[]): Promise<TreeNode[]> {
  const nodes: TreeNode[] = []

  for (let i = 0; i < rootNodes.length; i++) {
    await createCollectionNode(rootNodes[i]).then((node) => {
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
  node.label = response.data.title[0].title

  return node
}


async function getChildren(node: TreeNode): Promise<TreeNode[]> {
  const { id } = node
  const parentKey = node.key
  const { t } = getI18n()

  let data: Collection | Manifest

  if (!isCollectionUrl(node.id) && !isManifestUrl(node.id)) throw new CustomError('Error in TextAPI '+node.type , 'Id "'+ node.id +'" is provided incorrectly')

  if (isCollectionUrl(id)) {
    // If parent node is a collection, we initialize it like all collections, so it becomes available for panel loading
    data = await useDataStore.getState().initCollection(id)
  } else if (isManifestUrl(id)) {
    const response = await request<Manifest>(id)
    if (!response.success) throw new CustomError('Error '+(response as ErrorResponse).code, (response as ErrorResponse).message)
    data = response.data
  }

  if (!Object.hasOwn(data, 'sequence')) throw new CustomError('Invalid Content in TextAPI ' + node.type + ' with Id ' +node.id, '')
  if (data.sequence.length === 0) return []

  const items: Sequence[] = data.sequence

  return items.map(({ id, type, label = t('unknown_name') }) => ({
    id,
    type,
    label,
    key: parentKey + NODE_KEY_DELIMITER + id,
    leaf: type === 'item',
    expanded: false,
    children: []
  }))
}

async function getRootChildrenCollectionsIds(rootCollection: Collection) {
  const result = new Set()

  async function getChildrenCollectionIds(collection: Collection) {
    if (!collection.sequence || collection.sequence.length === 0) {
      result.add(collection.id)
      return
    }

    for (const item of collection.sequence) {
      if (item.type === 'collection') {
        result.add(item.id)
        const child = await apiRequest<Collection>(item.id)
        await getChildrenCollectionIds(child)
      }
    }
  }

  await getChildrenCollectionIds(rootCollection)
  return Array.from(result)
}

function getCollectionSlug(id: string) {
  const urlParts = id.split('/')
  return urlParts[urlParts.length - 2]
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
