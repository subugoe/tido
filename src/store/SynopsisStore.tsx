import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { getSource } from '@/utils/annotations.ts'
import { useDataStore } from '@/store/DataStore.tsx'

export interface SyncedTargetRef {
  source: AnnotationTargetSource
  selector: string
}

// The sync connection currently navigated to. Established by clicking a sync target, scrolling a
// panel, choosing witnesses in a synopsis popover or the TargetNavigation arrows. Every renderer
// highlights the connection's targets that live in its own text and scrolls its one into alignment.
export interface SynopsisConnection {
  // the target the connection was navigated from - the clicked, scrolled-to or arrow-navigated element
  navigatedTarget: HTMLElement | null
  // the targets it is synced with, kept as selector refs: each renderer resolves the ones of its
  // own source within its own DOM, so a source rendered in several panels is handled everywhere
  otherSyncedTargets: SyncedTargetRef[]
  // y-position of navigatedTarget within its scroll container's visible height (ignoring scroll
  // position), so every panel can scroll its own synced target to the same y-position
  yPos: number
}

export const EMPTY_SYNOPSIS_CONNECTION: SynopsisConnection = {
  navigatedTarget: null,
  otherSyncedTargets: [],
  yPos: 0
}

interface SynopsisStoreTypes {
  // all sync annotations discovered across collections, unique by annotation id.
  syncAnnotations: Annotation[]
  // sync annotations indexed by the content url (source.id) of their targets, so a renderer can
  // cheaply get only the annotations touching its own source - both to style/bind its targets and
  // to resolve a clicked target's synced targets on demand. Same annotation appears under every
  // source it targets.
  syncAnnotationsBySource: Map<string, Annotation[]>
  // the sync connection the panels are currently aligned on - highlighted and scrolled into alignment
  activeSynopsisConnection: SynopsisConnection
  // the synced targets of the target currently hovered - highlighted (without scrolling) while hovering
  hoveredSyncedTargets: SyncedTargetRef[]
  addSyncAnnotations: (annotations: Annotation[]) => void
  addSyncAnnotationsFromCollection: (collectionUrl: string) => Promise<void>
  setActiveSynopsisConnection: (activeSynopsisConnection: SynopsisConnection) => void
  setHoveredSyncedTargets: (hoveredSyncedTargets: SyncedTargetRef[]) => void
}

// Walk the collection tree until we find a collection that includes an annotationCollection.
async function findAnnotationCollectionUrl(collection: Collection): Promise<string | null> {
  if (collection.annotationCollection) return collection.annotationCollection
  if (!collection.collections) return null

  for (const child of collection.collections) {
    // Reuse the cached collection from DataStore when the child is referenced by URL.
    const childCollection = typeof child === 'string'
      ? await useDataStore.getState().initCollection(child)
      : child
    const found = await findAnnotationCollectionUrl(childCollection)
    if (found) return found
  }

  return null
}

export const useSynopsisStore = create<SynopsisStoreTypes>((set, get) => ({
  syncAnnotations: [],
  syncAnnotationsBySource: new Map(),
  activeSynopsisConnection: EMPTY_SYNOPSIS_CONNECTION,
  hoveredSyncedTargets: [],
  setActiveSynopsisConnection: (activeSynopsisConnection) => {
    set({ activeSynopsisConnection })
  },
  setHoveredSyncedTargets: (hoveredSyncedTargets) => {
    set({ hoveredSyncedTargets })
  },
  // Merge the given annotations into syncAnnotations (skipping any whose id is already known) and
  // index them by their targets' source. Only the arrays of the affected sources are replaced, so
  // renderers of untouched sources keep the same array reference (no needless re-renders).
  addSyncAnnotations: (annotations) => {
    if (!annotations || annotations.length === 0) return
    const existing = get().syncAnnotations
    const seen = new Set(existing.map((a) => a.id))
    const unique = annotations.filter((a) => a.id && !seen.has(a.id))
    if (unique.length === 0) return

    const bySource = new Map(get().syncAnnotationsBySource)
    const cloned = new Set<string>() // sources whose array we already copied in this call
    unique.forEach((annotation) => {
      // an annotation may target a source more than once - add it to that source only once
      const sourceIds = new Set(annotation.target.map((t) => getSource(t).id).filter(Boolean))
      sourceIds.forEach((sourceId) => {
        if (!cloned.has(sourceId)) {
          bySource.set(sourceId, [...(bySource.get(sourceId) ?? [])])
          cloned.add(sourceId)
        }
        bySource.get(sourceId).push(annotation)
      })
    })

    set({ syncAnnotations: [...existing, ...unique], syncAnnotationsBySource: bySource })
  },
  // Resolve a collection's annotationCollection (searching its subtree), load its sync
  // annotations and merge them uniquely into syncAnnotations.
  addSyncAnnotationsFromCollection: async (collectionUrl: string) => {
    const collection = await useDataStore.getState().initCollection(collectionUrl)
    const annotationCollectionUrl = await findAnnotationCollectionUrl(collection)
    if (!annotationCollectionUrl) return

    const annotationCollection = await apiRequest<AnnotationCollection>(annotationCollectionUrl)
    const annotationPage = await apiRequest<AnnotationPage>(annotationCollection.first)
    get().addSyncAnnotations(annotationPage.items ?? [])
  },
}))
