import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'


interface AnnotationMap {
  [key: string]: Annotation[]
}

interface DataStoreType {
  collections: CollectionMap
  annotations: AnnotationMap
  treeNodes: TreeNode[]
  initCollection: (url: string) => Promise<Collection>
  initAnnotations: (collectionId: string, url: string) => Promise<void>
  setTreeNodes: (newTreeNodes: TreeNode[]) => void
  getCollection: (collectionUrl: string) => Promise<Collection>,
  showGlobalTree: boolean,
  setShowGlobalTree: (newValue: boolean) => void,
}

export const useDataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  annotations: {},
  treeNodes: [],
  showGlobalTree: false,
  initCollection: async (url: string) => {
    const collection = await apiRequest<Collection>(url)
    const collections: CollectionMap = { ...get().collections }
    collections[collection.id] = collection
    set({ collections })

    if (collection.annotationCollection) {
      await get().initAnnotations(collection.id, collection.annotationCollection)
    }

    return collection
  },
  initAnnotations: async (collectionId: string, url: string) => {
    const annotationsCollection = await apiRequest<AnnotationCollection>(url)
    const annotationPage = await apiRequest<AnnotationPage>(annotationsCollection.first)
    set({ annotations: { ...get().annotations, [collectionId]: annotationPage.items } })
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
