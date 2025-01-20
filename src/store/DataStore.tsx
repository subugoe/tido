import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'

interface DataStoreType {
  collections: Collection[]
  initCollection: (url: string) => Promise<Collection>
}

export const dataStore = create<DataStoreType>((set, get) => ({
  collections: [],
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: Collection[] = [ ...get().collections ]
    collections.push(collection)
    set({ collections })
    return collection
  }
}))
