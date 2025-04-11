import { request } from '@/utils/http'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'

export async function createCollectionNodes(collections: CollectionMap): Promise<TreeNode[]> {
  const collectionsUrls = Object.keys(collections)
  if (collectionsUrls.length === 0) return []

  const nodes: TreeNode[] = []

  for (let i = 0; i < collectionsUrls.length; i++) {
    await createCollectionNode(collectionsUrls[i], i).then((node) => {
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

export async function getChildren(node: TreeNode): Promise<TreeNode[]> {
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


export function getNodeIndices(nodeKey: string) {
  return nodeKey.split('-').map((index) => parseInt(index, 10))
}

export async function isCollectionInTree(url: string) {

  const treeCollections = useDataStore.getState().treeCollections
  if (Object.keys(treeCollections).length === 0) return false
  if (Object.keys(treeCollections).includes(url)) return true


  for (const collectionId in treeCollections) {
    const collection = await apiRequest<Collection>(collectionId)
    if (await isCollectionInCollection(collection, url)) return true
  }

  return false
}

async function isCollectionInCollection(collection: Collection, url: string ) {
  if (collection.id === url) return true

  if (Array.isArray(collection.sequence)) {
    for (const item of collection.sequence) {
      if (item.type !== 'collection') continue
      const collection = await apiRequest<Collection>(item.id)
      if (await isCollectionInCollection(collection, url)) return true
    }
  }

  return false
}

export async function includesCollectionAsNested(parent: Collection, targetUrls: string[]): string[] {
  if (!parent || typeof parent !== 'object') return []

  if (Array.isArray(parent.sequence)) {
    for (const item of parent.sequence) {
      if (item.type !== 'collection') continue
      const child = await apiRequest<Collection>(item.id)
      if (targetUrls.includes(child.id)) {
        return [targetUrls.find(url => url === child.id) ?? '']
      }
      includesCollectionAsNested(child, targetUrls)
    }
  }

  return []
}

