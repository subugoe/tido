import { request } from '@/utils/http'

export async function getCollectionTreeNodes(collections: CollectionMap) {

  const collectionsUrls = Object.keys(collections)
  if (collectionsUrls.length === 0) return

  return await createTree(collectionsUrls)
}

export async function createTree(collectionsUrls: string[]) {
  const nodes: TreeNode[] = []

  for (let i = 0; i < collectionsUrls.length; i++) {
    await createNode(collectionsUrls[i], i).then((node) => {
      nodes.push(node)
    })
  }

  return nodes
}

async function createNode(url: string, key: number) {
  const node: TreeNode = { key: '', id: '', type: '', label: '' }

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

    if (!response.success) continue

    const childNode: TreeNode = {
      key: parentKey + '-' + i,
      id: items[i].id,
      label: items[i].label ?? 'label not found',
      type: items[i].type,
      expanded: false
    }

    if (childNode.type === 'item') childNode.leaf = true

    childrenNodes.push(childNode)
  }

  return childrenNodes
}


export function getNodeIndices(nodeKey: string) {
  return nodeKey.split('-').map((index) => parseInt(index, 10))
}


export async function onCollapse(node: TreeNode, nodes: TreeNode[]) {
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

  return updatedTree
}


export async function onExpand(node: TreeNode, nodes: TreeNode[]) {
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

  return updatedTree
}
