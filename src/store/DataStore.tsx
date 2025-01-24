import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { request } from '@/utils/http'
import { tree } from '@/utils/icons'

interface CollectionMap {
  [key: string]: Collection
}

interface DataStoreType {
  collections: CollectionMap,
  treeNodes: TreeNode[],
  initCollection: (url: string) => Promise<Collection>
  initTreeNodes: (newTreeNodes: TreeNode[]) => void,
  getCollection: (collectionUrl: string) => Promise<Collection>,
  addManifestChildrenNodes: (manifestUrl: string, collectionIndex: number, manifestIndex: number) => void,
  removeManifestChildrenNode: (collectionIndex: number, manifestIndex: number) => void
}

export const dataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  treeNodes: [],
  clickedItemUrl: '',
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: CollectionMap = { ...get().collections }
    collections[collection.id] = collection
    set({ collections })
    return collection
  },
  initTreeNodes: (newTreeNodes: TreeNode[]) => {
    set({ treeNodes: newTreeNodes })
    console.log('treeNodes', get().treeNodes)
  },

  async getCollection(collectionUrl: string): Promise<Collection> {
    if (collectionUrl in get().collections) return get().collections[collectionUrl]

    const collection = await get().initCollection(collectionUrl)
    return collection
  },

  async addManifestChildrenNodes(manifestUrl, collectionIndex, manifestIndex) {
    let updatedTree = [...get().treeNodes]
    const response = await request<Manifest>(manifestUrl)
    const manifestItems = response.data.sequence.map((item: { id: any; label: any }) => ({
      'id': item.id,
      'label': item.label,
    }))

    const manifestNode = updatedTree[collectionIndex].children[manifestIndex]
    if (!('children' in manifestNode)) {
      updatedTree[collectionIndex].children[manifestIndex]["children"] = manifestItems
      set({ treeNodes: updatedTree })
    }
  },

  removeManifestChildrenNode(collectionIndex: number, manifestIndex: number) {
    let updatedTree = [...get().treeNodes]

    delete updatedTree[collectionIndex].children[manifestIndex].children
    set({ treeNodes: updatedTree })
  }

}))
