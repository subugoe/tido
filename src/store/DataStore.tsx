import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'

interface CollectionMap {
  [key: string]: Collection
}

interface AnnotationMap {
  [key: string]: Annotation[]
}

interface DataStoreType {
  collections: CollectionMap
  annotations: AnnotationMap
  initCollection: (url: string) => Promise<Collection>
  initAnnotations: (collectionId: string, url: string) => Promise<void>
}

export const dataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  annotations: {},
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: CollectionMap = { ...get().collections }
    collections[collection.id] = collection
    set({ collections })
    return collection
  },
  initAnnotations: async (collectionId: string, url: string) => {
    const annotationsCollection = await apiRequest<AnnotationCollection>(url)
    const annotationPage = await apiRequest<AnnotationPage>(annotationsCollection.first)
    set({ annotations: { ...get().annotations, [collectionId]: annotationPage.items } })
  }
}))
