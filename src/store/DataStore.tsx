import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { request } from '@/utils/http'

interface CollectionMap {
  [key: string]: Collection
}

interface DataStoreType {
  collections: CollectionMap,
  treeNodes: any,
  initCollection: (url: string) => Promise<Collection>
  initTreeNodes: (newTreeNodes: CollectionNode[]) => void,
  getCollection: (collectionUrl: string) => Promise<Collection>,
  addManifestChildrenNode: (manifestUrl: string, collectionIndex: number, manifestIndex: number) => void,
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
  initTreeNodes: (newTreeNodes: CollectionNode[]) => {
    set({ treeNodes: newTreeNodes })
  },

  async getCollection(collectionUrl: string): Promise<Collection> {
    console.log('collections', get().collections)
    console.log('current collection url', collectionUrl)
    if (collectionUrl in get().collections) return get().collections[collectionUrl]

    const collection = await get().initCollection(collectionUrl)
    return collection
  },

  async addManifestChildrenNode(manifestUrl, collectionIndex, manifestIndex) {
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

}))
