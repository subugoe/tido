import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'


interface AnnotationMap {
  [key: string]: Annotation[]
}

interface DataStoreType {
  collections: CollectionMap
  treeCollections: any
  annotations: AnnotationMap
  treeNodes: TreeNode[]
  initCollection: (url: string) => Promise<Collection>
  initAnnotations: (collectionId: string, url: string) => Promise<void>
  setTreeNodes: (newTreeNodes: TreeNode[]) => void
  showGlobalTree: boolean,
  setShowGlobalTree: (newValue: boolean) => void,
  appendCollectionInTree: (newCollectionId: string) => void,
  removeChildCollectionsInTree: (child: string) => void
}

export const useDataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  treeCollections: {},
  annotations: {},
  treeNodes: [],
  showGlobalTree: false,
  initCollection: async (url: string) => {

    if (url in get().collections) return get().collections[url]

    const collection = await apiRequest<Collection>(url)

    // TODO: we need to check if this collection is already in treeCollections or child of existing treeCollections data, if not we add a new entry in treeCollections

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
  setShowGlobalTree: (newValue: boolean) => {
    set({ showGlobalTree: newValue })
  },
  appendCollectionInTree: (newCollectionId: string) => {
    set( { treeCollections: { ...get().treeCollections, [newCollectionId]: '' } })
  },

  removeChildCollectionsInTree: (child: string) => {
    const newTreeCollections = get().collections
    delete newTreeCollections[child]
    set({ treeCollections: newTreeCollections })
  }

}))
