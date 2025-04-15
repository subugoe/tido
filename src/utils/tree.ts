import { request } from '@/utils/http'
import { useDataStore } from '@/store/DataStore.tsx'

async function createCollectionNodes(collections: CollectionMap): Promise<TreeNode[]> {
  const collectionsUrls = Object.keys(collections)
  if (collectionsUrls.length === 0) return []

  const nodes: TreeNode[] = []

  for (let i = 0; i < collectionsUrls.length; i++) {
    await createCollectionNode(collectionsUrls[i], i).then(async (node) => {
      nodes.push(node)
    })
  }

  return nodes
}

async function createCollectionNode(url: string, key: number) {
  const node: TreeNode = { key: '', id: '', type: '', label: '', children: [] }

  const response = await request<Collection>(url)
  if (!response.success) return node

  node.key = key.toString()
  node.id = url
  node.type = 'collection'
  node.label = response.data.title[0].title

  return node
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
      key: parentKey + '-' + i,
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


function getNodeIndices(nodeKey: string) {
  return nodeKey.split('-').map((index) => parseInt(index, 10))
}

async function getLeafCollection(panelConfig: PanelConfig) {
  let collectionId: string = panelConfig.collection
  let collection
  while (true) {
    collection = await useDataStore.getState().initCollection(collectionId)

    if (collection.sequence[0].type === 'manifest') break
    collectionId = collection.sequence[0].id
  }

  return collection
}

export { getLeafCollection, createCollectionNodes, getChildren, getNodeIndices }
