import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { isCollectionUrl, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { getI18n } from 'react-i18next'
import { CustomError } from '@/utils/custom-error.ts'
import { createCollectionNodes } from '@/utils/tree.ts'


interface AnnotationMap {
  [key: string]: Annotation[]
}

export interface ManifestMap {
  [key: string]: Manifest
}

export interface ItemMap {
  [key: string]: Item
}

function cacheEmbeddedManifests(
  get: () => DataStoreType,
  set: (partial: Partial<DataStoreType>) => void,
  manifests: (Manifest | string)[]
) {
  const next = { ...get().manifests }
  let changed = false
  for (const m of manifests) {
    if (typeof m === 'object') {
      next[m.id] = m
      changed = true
      if (m.items) {
        cacheEmbeddedItems(get, set, m.items)
      }
    }
  }
  if (changed) set({ manifests: next })
}

function cacheEmbeddedItems(
  get: () => DataStoreType,
  set: (partial: Partial<DataStoreType>) => void,
  items: (Item | string)[]
) {
  const next = { ...get().items }
  let changed = false
  for (const i of items) {
    if (typeof i === 'object') {
      next[i.id] = i
      changed = true
    }
  }
  if (changed) set({ items: next })
}

// Inflight maps track ongoing fetches by URL. When multiple callers request the same resource
// before the first fetch completes, they share the same promise instead of firing duplicate
// requests. Entries are cleaned up in the `finally` block once the promise settles.
const inflightCollections = new Map<string, Promise<Collection>>()
const inflightManifests = new Map<string, Promise<Manifest>>()
const inflightItems = new Map<string, Promise<Item>>()

interface DataStoreType {
  collections: CollectionMap
  manifests: ManifestMap
  items: ItemMap
  annotations: AnnotationMap
  treeNodes: TreeNode[]
  initCollection: (url: string) => Promise<Collection>
  initManifest: (url: string) => Promise<Manifest>
  initItem: (url: string) => Promise<Item>
  initAnnotations: (collectionId: string, url: string) => Promise<void>
  appendRootNode: (newNode: TreeNode) => void,
  showGlobalTree: boolean,
  setShowGlobalTree: (newValue: boolean) => void,
  createTreeNodes: (rootCollections: string[]) => void
}

export const useDataStore = create<DataStoreType>((set, get) => ({
  collections: {},
  manifests: {},
  items: {},
  annotations: {},
  treeNodes: [],
  appendRootNode: ( newNode: TreeNode ) => {
    set({ treeNodes: [...get().treeNodes, newNode] })
  },
  showGlobalTree: false,
  initCollection: async (url: string) => {
    if (url in get().collections) return get().collections[url]
    const { t } = getI18n()

    if (!isCollectionUrl(url)) throw new CustomError(null, t('error_collection_url', { url }))

    if (inflightCollections.has(url)) return inflightCollections.get(url)!

    const promise = (async () => {
      const collection = await apiRequest<Collection>(url)

      const collections: CollectionMap = { ...get().collections }
      collections[collection.id] = collection
      set({ collections })

      if (collection.manifests) {
        cacheEmbeddedManifests(get, set, collection.manifests)
      }

      return collection
    })()

    inflightCollections.set(url, promise)
    try {
      return await promise
    } finally {
      inflightCollections.delete(url)
    }
  },
  initManifest: async (url: string) => {
    if (url in get().manifests) return get().manifests[url]
    const { t } = getI18n()

    if (!isManifestUrl(url)) throw new CustomError(null, t('error_invalid_manifest_url', { url }))

    if (inflightManifests.has(url)) return inflightManifests.get(url)!

    const promise = (async () => {
      const manifest = await apiRequest<Manifest>(url)

      const manifests = { ...get().manifests }
      manifests[manifest.id] = manifest
      set({ manifests })

      if (manifest.items) {
        cacheEmbeddedItems(get, set, manifest.items)
      }

      return manifest
    })()

    inflightManifests.set(url, promise)
    try {
      return await promise
    } finally {
      inflightManifests.delete(url)
    }
  },
  initItem: async (url: string) => {
    if (url in get().items) return get().items[url]
    const { t } = getI18n()

    if (!isItemUrl(url)) throw new CustomError(null, t('error_invalid_item_url', { url }))

    if (inflightItems.has(url)) return inflightItems.get(url)!

    const promise = (async () => {
      const item = await apiRequest<Item>(url)

      const items = { ...get().items }
      items[item.id] = item
      set({ items })

      return item
    })()

    inflightItems.set(url, promise)
    try {
      return await promise
    } finally {
      inflightItems.delete(url)
    }
  },
  initAnnotations: async (collectionId: string, url: string) => {
    const annotationsCollection = await apiRequest<AnnotationCollection>(url)
    const annotationPage = await apiRequest<AnnotationPage>(annotationsCollection.first)
    set({ annotations: { ...get().annotations, [collectionId]: annotationPage.items } })
  },
  createTreeNodes: async (rootCollections: string[]) => {
    const nodes = await createCollectionNodes(rootCollections)
    set({ treeNodes: nodes })
  },
  setShowGlobalTree: (newValue: boolean) => {
    set({ showGlobalTree: newValue })
  }
}))
