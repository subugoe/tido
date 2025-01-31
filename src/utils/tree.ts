import { request } from '@/utils/http'

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
  const node: TreeNode = {}
  const response = await request<Collection>(url)
  if (!response.success) return node
  node.key = key.toString()
  node.id = url
  node.type = 'collection'
  node.label = response.data.title[0].title

  return node
}

export async function getChildren(node: TreeNode): Promise<TreeNode[] | null> {
  const { id } = node
  const parentKey = node.key

  const childrenNodes: TreeNode[] = []
  const response = await request(id)

  if (!response.success) return null
  const data = response.data

  if (!data.sequence) return null
  if (data.sequence.length === 0) return null

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
