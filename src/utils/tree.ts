
import { request } from '@/utils/http'

export async function createTree(panels: PanelConfig[]) {
  if (!panels || panels.length === 0) return []

  const nodes: CollectionNode[] = []

  for (let i = 0; i < panels.length; i++) {
    await createNode(panels[i].entrypoint.url, i).then((node) => {
      nodes.push(node)
    })
  }

  return nodes
}

async function createNode(url: string, key) {
  const node = {}
  const response = await request<Collection>(url)
  if (!response.success) return node

  node['id'] = url
  node['label'] = response.data.title[0].title

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
  return manifest.children.findIndex((item: ItemNode) => item.url === itemUrl)
}