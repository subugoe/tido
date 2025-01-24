
import { request } from '@/utils/http'

export async function createTree(panels: PanelConfig[]) {
  if (!panels || panels.length === 0) return []

  const nodes: TreeNode[] = []

  for (let i = 0; i < panels.length; i++) {
    await createNode(panels[i].entrypoint.url, i).then((node) => {
      nodes.push(node)
    })
  }

  console.log('created nodes', nodes)
  return nodes
}

async function createNode(url: string, key) {
  const node = {}
  const response = await request<Collection>(url)
  if (!response.success) return node

  node['id'] = url
  node['label'] = response.data.title[0].title
  node['type'] = 'collection'

  if (response.data.sequence?.length > 0) {
    node['children'] = await getChildrenNodes(response.data)
  }

  return node
}

async function getChildrenNodes(data) {

  if (!('sequence' in data) || data.sequence.length === 0) return []

  const items: Sequence[] = data.sequence
  const nodes = items.map((item) => ({
    'id': item.id,
    'label': item.label,
    'type': 'manifest',
  }
  ))
  return nodes
}

export function clickedManifestIndices(manifestUrl: string, treeNodes) {

  for (let i = 0; i < treeNodes.length; i++) {
    const manifestIndex = treeNodes[i].children.findIndex((item) => item.id === manifestUrl)
    if (manifestIndex !== -1) {
      return {
        collectionIndex: i,
        manifestIndex: manifestIndex
      }
    }
  }

  return -1
}

export function getNodeIndices(url: string, treeNodes) {
  for (let i = 0; i < treeNodes.length; i++) {
    if (url === treeNodes[i].id) return {
      collectionIndex: i
    }
    const manifestIndex = treeNodes[i].children.findIndex((item) => item.id === url)
    if (manifestIndex !== -1) {
      return {
        collectionIndex: i,
        manifestIndex: manifestIndex,
      }
    }

    const itemIndices = findItemIndex(i, treeNodes[i].children, url)

    if (itemIndices) return itemIndices
  }

  return null
}

function findItemIndex(collectionIndex: number, manifestsNodes, itemUrl: string) {
  for (let i = 0; i < manifestsNodes.length; i++) {
    const itemIndex = getItemIndex(manifestsNodes[i], itemUrl)
    if (itemIndex !== -1) {
      return {
        collectionIndex: collectionIndex,
        manifestIndex: i,
        itemIndex: itemIndex,
        nodeType: 'item'
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

export function getItemIndices(itemUrl: string, treeNodes: CollectionNode[]): ItemIndices | null {

  for (let i = 0; i < treeNodes.length; i++) {
    const collectionNode = treeNodes[i]

    if (!collectionNode.children || collectionNode.children.length === 0) return null

    for (let j = 0; j < collectionNode.children.length; j++) {

      const manifest = collectionNode.children[j]

      if (!manifest.children || manifest.children.length === 0) continue

      const itemIndex = getItemIndex(manifest, itemUrl)
      if (itemIndex !== -1) {
        return {
          collectionUrl: collectionNode.url,
          manifestIndex: j,
          itemIndex: itemIndex
        }
      }
    }
  }

  return null
}


function getItemIndex(manifest: ManifestNode, itemUrl: string): number {
  if ('children' in manifest) return manifest.children.findIndex((item: ItemNode) => item.id === itemUrl)
  return -1
}