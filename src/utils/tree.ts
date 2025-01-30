import { request } from '@/utils/http'


interface ManifestIndices {
    collectionIndex: number,
    manifestIndex: number
}

interface ItemIndices {
    collectionUrl: string,
    manifestIndex: number,
    itemIndex: number
}

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


export function getManifestIndices(nodeKey: string): ManifestIndices {
    const collectionIndex = parseInt(nodeKey.split('-')[0])
    const manifestIndex = parseInt(nodeKey.split('-')[1])

    return { collectionIndex: collectionIndex, manifestIndex: manifestIndex }
}

export function getItemIndices(nodeKey: string, treeNodes: TreeNode[]): ItemIndices {
    const collectionIndex = parseInt(nodeKey.split('-')[0])

    const collectionUrl = treeNodes[collectionIndex].id
    const manifestIndex = parseInt(nodeKey.split('-')[1])
    const itemIndex = parseInt(nodeKey.split('-')[2])

    return { collectionUrl: collectionUrl, manifestIndex: manifestIndex, itemIndex: itemIndex }
}
