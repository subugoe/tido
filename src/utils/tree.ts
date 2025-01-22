
import { request } from '@/utils/http'

export async function createTree(panels: PanelConfig[]) {
    if (!panels || panels.length === 0) return [] 

    const nodes = []
    
    for (let i = 0; i< panels.length; i++) {
        const collectionNode = await createCollectionNode(panels[i].entrypoint.url, i).then((node) => {
            nodes.push(node)
        })
    }

    return nodes
}



async function createCollectionNode(url: string, key: number) {
  const node = {}
  const response = await request<Collection>(url)
  if (!response.success) return node
  const collectionTitle = response.data.title[0].title

  node['url'] = url
  node['key'] = key
  node['title'] = collectionTitle
  node['children'] = await getManifestNodes(node, response.data.sequence)

  return node
}

async function getManifestNodes(parentNode, manifests) {
    // items: 'sequence items' of collection 
    if (!manifests || manifests.length === 0) return []

    const collectionNode = { ...parentNode }
    collectionNode['children'] = []

    for (let i = 0; i < manifests.length; i++) {
      // here node refers to manifestNode
      const node = {}
      node['key'] = collectionNode.key + '-' + i.toString()
      node['label'] = manifests[i].label 
      
      // getItemsTitles
      const response = await request<Manifest>(manifests[i].id)
      if (!response.success) continue

      const data = response.data
      node['children'] = getItemsNodes(node['key'], data.sequence)
      
      collectionNode['children'].push(node)
    }
    return collectionNode['children']
  }

function getItemsNodes(parentKey: string, items: Sequence[]) {
    const nodes = []
    for (let i = 0; i < items.length ; i++) {
        nodes.push({ label: items[i].label, key: parentKey + '-' + i, url: items[i].id })
    }
    return nodes
}

interface ClickedItemIndices {
    collectionUrl: string,
    manifestIndex: number,
    itemIndex: number
}

export function getClickedItemIndices(itemUrl: string, treeNodes: CollectionNode[]): ClickedItemIndices | null{
    // find the collection url when clicking an item in local tree
    
    for (let i = 0; i < treeNodes.length ; i++) {
      const collectionNode = treeNodes[i]

      if (!collectionNode.children || collectionNode.children.length === 0) return null

      for (let j = 0; j < collectionNode.children.length; j++) {

        const manifest = collectionNode.children[j]

        const itemIndex = getItemIndex(manifest, itemUrl)
        if (itemIndex !== null) {
            return {
                collectionUrl: collectionNode.url,
                manifestIndex: j,
                itemIndex: itemIndex
            }
        }
      }
    }

    console.log('----')

    return null
  }


  function getItemIndex(manifest, itemUrl: string): number | null {
    const items = manifest.children
    for (let i = 0; i < items.length ; i++) {
      if (items[i].url === itemUrl) return i
    }

    return null
  }