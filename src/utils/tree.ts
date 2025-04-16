import { request } from '@/utils/http'
import { useDataStore } from '@/store/DataStore.tsx'

async function createCollectionNodes(rootNodes: string[]): Promise<TreeNode[]> {
  const nodes: TreeNode[] = []

  for (let i = 0; i < rootNodes.length; i++) {
    await createCollectionNode(rootNodes[i]).then((node) => {
      nodes.push(node)
    })
  }

  return nodes
}

async function createCollectionNode(url: string) {
  const node: TreeNode = { key: '', id: '', type: '', label: '', children: [] }

  const response = await request<Collection>(url)
  if (!response.success) return node

  node.key = getCollectionSlug(url)
  node.id = url
  node.type = 'collection'
  node.label = response.data.title[0].title

  return node
}

async function appendRootNodeInTree(collectionUrl: string) {
  const newRootNode = await createCollectionNode(collectionUrl)
  useDataStore.getState().appendRootNode(newRootNode)
}

async function getChildren(node: TreeNode): Promise<TreeNode[]> {
  const { id } = node
  const parentKey = node.key

  const childrenNodes: TreeNode[] = []
  const response = await request<Collection | Manifest>(id)

  if (!response.success) return childrenNodes
  const data = response.data

  if (!data.sequence) return childrenNodes
  if (data.sequence.length === 0) return childrenNodes

  const items: Sequence[] = data.sequence

  for (let i = 0; i < items.length; i++) {
    const childNode: TreeNode = {
      key: parentKey + ',' + (items[i].type === 'collection' ? getCollectionSlug(items[i].id) : i.toString()),
      id: items[i].id,
      label: items[i].label ?? 'label not found',
      type: items[i].type,
      leaf: items[i].type === 'item',
      children: []
    }

    childrenNodes.push(childNode)
  }

  return childrenNodes
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

export {  createCollectionNodes, getChildren, appendRootNodeInTree,
  getNodeIndices, getSelectedItemIndices, getCollectionSlug
}
