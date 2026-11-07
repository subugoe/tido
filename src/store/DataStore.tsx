import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { detectDtsResponse, expandTemplate, normalizeDtsCollection, normalizeDtsResource, resolveUrl } from '@/utils/dts.ts'
import { DtsCollectionResponse, DtsEntryPoint } from '@/utils/dts.ts'
import { createCollectionNodes } from '@/utils/tree.ts'
import { getFirstPageUrl, getPageAnnotations } from '@/utils/annotation-data.ts'


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
  manifests: (Manifest | MinimalResource | string)[]
) {
  const next = { ...get().manifests }
  let changed = false
  for (const m of manifests) {
    if (typeof m === 'object' && 'items' in m) {
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
  createTreeNodes: (rootCollections: string[]) => Promise<void>
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
  initCollection: async (url: string) => {
    if (url in get().collections) return get().collections[url]

    if (inflightCollections.has(url)) return inflightCollections.get(url)!

    const promise = (async () => {
      let raw = await apiRequest<unknown>(url)
      let collectionTemplate: string | undefined

      // DTS entry points only hand out endpoint templates, so follow them to the root collection.
      if (detectDtsResponse(raw) === 'entry') {
        collectionTemplate = (raw as DtsEntryPoint).collection
        raw = await apiRequest<unknown>(resolveUrl(expandTemplate(collectionTemplate), url))
      }

      const kind = detectDtsResponse(raw)

      // A readable document at the collection endpoint: normalize as manifest, but also cache it
      // as a collection so a root url pointing at a Resource resolves in the tree.
      if (kind === 'resource') {
        const manifest = normalizeDtsResource(raw as Parameters<typeof normalizeDtsResource>[0], url)
        set({
          manifests: { ...get().manifests, [manifest.id]: manifest },
          collections: { ...get().collections, [url]: manifest as unknown as Collection }
        })
        return manifest as unknown as Collection
      }

      const collection = kind === 'collection'
        ? await normalizeDtsCollection(raw as DtsCollectionResponse, url, collectionTemplate)
        : raw as Collection

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

    if (inflightManifests.has(url)) return inflightManifests.get(url)!

    const promise = (async () => {
      const raw = await apiRequest<unknown>(url)
      const kind = detectDtsResponse(raw)
      const manifest = kind === 'resource'
        ? normalizeDtsResource(raw as Parameters<typeof normalizeDtsResource>[0], url)
        : raw as Manifest

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

    if (inflightItems.has(url)) return inflightItems.get(url)!

    const promise = (async () => {
      const raw = await apiRequest<unknown>(url)

      // DTS document endpoints answer with the text itself when accessed cold (e.g. a restored
      // bookmark without its manifest): wrap it in a minimal item instead of failing.
      if (typeof raw === 'string') {
        const item = {
          id: url,
          textapiType: 'TextApiItem',
          textItemType: 'full',
          contents: [{ id: url, contentType: 'text/html' }],
          created: '',
          modified: '',
          revision: '',
          textapiVersion: '2.0.0'
        } as unknown as Item
        const items = { ...get().items, [url]: item }
        set({ items })
        return item
      }

      const item = raw as Item

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
    const annotationPage = await apiRequest<AnnotationPage>(getFirstPageUrl(annotationsCollection))
    set({ annotations: { ...get().annotations, [collectionId]: getPageAnnotations(annotationPage) } })
  },
  createTreeNodes: async (rootCollections: string[]) => {
    const nodes = await createCollectionNodes(rootCollections)
    set({ treeNodes: nodes })
  }
}))
