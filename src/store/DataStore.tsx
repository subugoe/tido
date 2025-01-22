import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'

interface DataStoreType {
  collections: Collection[]
  annotations: { [key: string]: never }
  initCollection: (url: string) => Promise<Collection>
  initAnnotations: (collectionId: string, url: string) => Promise<void>
}

export const dataStore = create<DataStoreType>((set, get) => ({
  collections: [],
  annotations: {},
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: Collection[] = [ ...get().collections ]
    collections.push(collection)
    set({ collections })
    return collection
  },
  initAnnotations: async (collectionId: string, url: string) => {
    const annotationsCollection = await apiRequest<never>(url)
    set({ ...get().annotations, [collectionId]: annotationsCollection })
  }
}))
