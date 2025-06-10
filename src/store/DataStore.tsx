import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { getCollectionSlug } from '@/utils/tree.ts'


interface AnnotationMap {
  [key: string]: Annotation[]
}

interface DataStoreType {
  collections: CollectionMap
  annotations: AnnotationMap
  treeNodes: TreeNode[]
  initCollection: (url: string) => Promise<Collection>
  initAnnotations: (collectionId: string, url: string) => Promise<void>
  setTreeNodes: (newTreeNodes: TreeNode[]) => void,
  appendRootNode: (newNode: TreeNode) => void,
  showGlobalTree: boolean,
  setShowGlobalTree: (newValue: boolean) => void,
}

export const useDataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  annotations: {},
  treeNodes: [],
  appendRootNode: ( newNode: TreeNode ) => {
    set({ treeNodes: [...get().treeNodes, newNode] })
  },
  showGlobalTree: false,
  initCollection: async (url: string) => {
    if (url in get().collections) return get().collections[url].collection

    try {
      const collection = await apiRequest<Collection>(url)

      // TODO: we need to check if this collection is already in treeCollections or child of existing treeCollections data
      const collections: CollectionMap = { ...get().collections }
      collections[collection.id] = {
        'collection': collection,
        'slug': getCollectionSlug(url)
      }
      set({ collections })

      // TODO: fix annotation loading
      // if (collection.annotationCollection) {
      //   await get().initAnnotations(collection.id, collection.annotationCollection)
      // }

      return collection
    } catch (error) {
      console.error(error)
    }
  },
  initAnnotations: async (collectionId: string, url: string) => {
    const annotationsCollection = await apiRequest<AnnotationCollection>(url)
    const annotationPage = await apiRequest<AnnotationPage>(annotationsCollection.first)
    set({ annotations: { ...get().annotations, [collectionId]: annotationPage.items } })
  },
  setTreeNodes: (newTreeNodes: TreeNode[]) => {
    set({ treeNodes: newTreeNodes })
  },
  setShowGlobalTree: (newValue: boolean) => {
    set({ showGlobalTree: newValue })
  }
}))
