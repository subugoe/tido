import { request } from '@/utils/http'
import { useDataStore } from '@/store/DataStore.tsx'
import { isCollectionUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { getI18n } from 'react-i18next'

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

  node.key = getCollectionSlug(url)
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

  if (isCollectionUrl(id)) {
    // If parent node is a collection, we initialize it like all collections, so it becomes available for panel loading
    data = await useDataStore.getState().initCollection(id)
  } else if (isManifestUrl(id)) {
    const response = await request<Manifest>(id)
    if (!response.success) return []
    data = response.data
  }

  if (!data.sequence || data.sequence.length === 0) return []

  const items: Sequence[] = data.sequence

  return items.map(({ id, type, label = t('unknown_name') }, i) => ({
    id,
    type,
    label,
    key: parentKey + ',' + (type === 'collection' ? getCollectionSlug(id) : i.toString()),
    leaf: type === 'item',
    expanded: false,
    children: []
  }))
}

function getCollectionSlug(id: string) {
  const urlParts = id.split('/')
  return urlParts[urlParts.length - 2]
}

function getNodeIndices(nodeKey: string) {
  return nodeKey.split(',')
}

function getSelectedItemIndices(node: TreeNode){
  const collections = useDataStore.getState().collections
  const indices = getNodeIndices(node.key)
  const collectionSlug = indices[indices.length - 3]
  const manifestIndex = parseInt(indices[indices.length - 2], 10)
  const itemIndex = parseInt(indices[indices.length - 1], 10)
  const collectionUrl = Object.keys(collections).filter(key => collections[key].slug === collectionSlug)[0]

  return { collectionUrl: collectionUrl, manifestIndex: manifestIndex, itemIndex: itemIndex }
}

async function getExpandedNode(node: TreeNode): Promise<TreeNode> {
  node.children = [...await getChildren(node)]
  if (node.children.length > 0) node.expanded = true
  return node
}

export {  createCollectionNode, createCollectionNodes, getChildren,
  getNodeIndices, getSelectedItemIndices, getCollectionSlug, getExpandedNode
}
