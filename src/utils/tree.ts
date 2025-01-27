
import { request } from '@/utils/http'

export async function createTree(panels: PanelConfig[]) {
  if (!panels || panels.length === 0) return []

  const nodes: TreeNode[] = []

  for (let i = 0; i < panels.length; i++) {
    await createNode(panels[i].entrypoint.url, i).then((node) => {
      nodes.push(node)
    })
  }

  return nodes
}

async function createNode(url: string, key: number) {
  const node = {}
  const response = await request<Collection>(url)
  if (!response.success) return node
  node['key'] = key.toString()
  node['id'] = url
  node['expanded'] = false
  node['type'] = 'collection'
  node['label'] = response.data.title[0].title

  return node
}

export async function getChildren(node: TreeNode): Promise<TreeNode[] | null> {
  const { id } = node
  const parentKey = node.key

  let childrenNodes: TreeNode[] = []
  const response = await request(id)

  if (!response.success) return null
  const data = response.data

  if (!data.sequence) return null
  if (data.sequence.length === 0) return null

  const items: Sequence[] = data.sequence

  for (let i = 0; i < items.length; i++) {

    if (!response.success) continue
    let childNode: TreeNode = {
      'key': parentKey + '-' + i,
      'id': items[i].id,
      'label': items[i].label ?? 'label not found',
      'type': items[i].type,
    }

    if (childNode.type === 'manifest') {
      childNode['expanded'] = false
    }

    else if (childNode.type === 'item') {
      childNode['selectable'] = true
    }

    childrenNodes.push(childNode)
  }

  return childrenNodes
}


export function getManifestIndices(node: TreeNode, treeNodes: TreeNode[]) {
  const { id } = node

  for (let i = 0; i < treeNodes.length; i++) {

    if (!('children' in treeNodes[i])) continue

    const manifestIndex = treeNodes[i].children?.findIndex((item) => item.id === id)

    if (manifestIndex !== -1) {
      return {
        collectionIndex: i,
        manifestIndex: manifestIndex,
      }
    }
  }
}

export function getItemIndices(node: TreeNode, treeNodes: TreeNode[]) {

  const itemUrl = node.id

  for (let i = 0; i < treeNodes.length; i++) {

    // we search itemIndices in the current extended collection - which has manifests as children
    if (!('children' in treeNodes[i])) continue

    const manifestsNodes = treeNodes[i].children

    if (!manifestsNodes) return null

    for (let j = 0; j < manifestsNodes.length; j++) {
      const itemIndex = findItemIndexInManifest(manifestsNodes[j], itemUrl)

      if (itemIndex !== -1) {
        return {
          collectionIndex: i,
          manifestIndex: j,
          itemIndex: itemIndex,
          nodeType: 'item'
        }
      }
    }
  }

  return null
}

interface ItemIndices {
  collectionUrl: string,
  manifestIndex: number,
  itemIndex: number
}



function findItemIndexInManifest(manifest: ManifestNode, itemUrl: string): number {
  if ('children' in manifest) return manifest.children.findIndex((item: ItemNode) => item.id === itemUrl)
  return -1
}