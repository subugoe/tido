import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'

interface CollectionMap {
  [key: string]: Collection
}

interface DataStoreType {
  collections: CollectionMap
  initCollection: (url: string) => Promise<Collection>
}

export const dataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: CollectionMap = { ...get().collections }
    collections[collection.id] = collection
    set({ collections })
    return collection
  }
}))
