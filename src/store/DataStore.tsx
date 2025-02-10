import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'


interface DataStoreType {
  collections: CollectionMap,
  treeNodes: TreeNode[],
  initCollection: (url: string) => Promise<Collection>
  setTreeNodes: (newTreeNodes: TreeNode[]) => void,
  getCollection: (collectionUrl: string) => Promise<Collection>,
  showGlobalTree: boolean,
  setShowGlobalTree: (newValue: boolean) => void,
}

export const dataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  treeNodes: [],
  showGlobalTree: false,
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: CollectionMap = { ...get().collections }
    collections[collection.id] = collection
    set({ collections })
    return collection
  },
  setTreeNodes: (newTreeNodes: TreeNode[]) => {
    set({ treeNodes: newTreeNodes })
  },

  async getCollection(collectionUrl: string): Promise<Collection> {
    if (collectionUrl in get().collections) return get().collections[collectionUrl]

    const collection = await get().initCollection(collectionUrl)
    return collection
  },
  setShowGlobalTree: (newValue: boolean) => {
    set({ showGlobalTree: newValue })
  }
}))
