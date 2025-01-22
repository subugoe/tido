import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'

interface CollectionMap {
  [key: string]: Collection
}

interface DataStoreType {
  collections: CollectionMap,
  treeNodes: CollectionNode[],
  clickedItemUrl: string,
  initCollection: (url: string) => Promise<Collection>
  initTreeNodes: (newTreeNodes: CollectionNode[]) => void,
  setClickedItemUrl: (newUrl: string) => void
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
    set({ treeNodes: newTreeNodes})
  },

  setClickedItemUrl: (newUrl: string) => {
    set({clickedItemUrl: newUrl})
  }

}))
