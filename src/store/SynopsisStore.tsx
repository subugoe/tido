import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { getSource } from '@/utils/annotations.ts'
import { useDataStore } from '@/store/DataStore.tsx'

interface SyncedTargetRef {
  contentUrl: string
  selector: string
}

interface SyncTarget {
  targetEl: HTMLElement | null
  panelId: string
  syncedTargets: SyncedTargetRef[]
  selector: string[]
}

// contentUrl -> selector value -> sync target
type SyncMaps = Record<string, Record<string, SyncTarget>>

interface SynopsisStoreTypes {
  syncMaps: SyncMaps
  setSyncMap: (key: string, value: Record<string, SyncTarget>) => void
  removeSyncMap: (key: string) => void
  resetSyncMaps: () => void,
  addSyncTargets: (collectionUrl: string) => Promise<void>,
  assignTargetEls: (source: string, panelEl: HTMLElement | null, panelId: string) => void,
}

// Only CssSelectors carry a `value`. RangeSelectors are not handled yet (see findTargets in utils/annotations).
function getSelectorValue(target: AnnotationTarget): string | null {
  if (target.selector?.type === 'CssSelector') return target.selector.value
  return null
}

// Walk the collection tree until we find a collection that declares an annotationCollection.
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
  syncMaps: {},
  setSyncMap: (key, value) => {
    set({ syncMaps: { ...get().syncMaps, [key]: value } })
  },
  removeSyncMap: (key) => {
    const { [key]: _removed, ...rest } = get().syncMaps
    set({ syncMaps: rest })
  },
  resetSyncMaps: () => {
    set({ syncMaps: {} })
  },
  addSyncTargets: async (collectionUrl: string) => {
    // check if annotationCollection is provided
    // if not, check for collections key recursively -> in each collection object, check for annotationCollection
    const collection = await useDataStore.getState().initCollection(collectionUrl)
    const annotationCollectionUrl = await findAnnotationCollectionUrl(collection)
    if (!annotationCollectionUrl) return

    // load annotationCollection url, .first
    const annotationCollection = await apiRequest<AnnotationCollection>(annotationCollectionUrl)

    // load syncAnnotations
    const annotationPage = await apiRequest<AnnotationPage>(annotationCollection.first)
    const syncAnnotations = annotationPage.items

    // updateSyncMap
    // for each annotation, go through each target
    // each target create an object
    // {contentUrl: {selectorValue: {targetEl: null, panelId: '', syncedTargets:[], selector: []}}} -> in selector append value of selector.value from Annotation target
    //   {
    //   }
    //   }
    const syncMaps: SyncMaps = { ...get().syncMaps }

    syncAnnotations.forEach((annotation) => {
      annotation.target.forEach((target) => {
        const contentUrl = getSource(target).id
        const selectorValue = getSelectorValue(target)
        if (!contentUrl || !selectorValue) return

        if (!syncMaps[contentUrl]) syncMaps[contentUrl] = {}
        if (!syncMaps[contentUrl][selectorValue]) {
          syncMaps[contentUrl][selectorValue] = {
            targetEl: null,
            panelId: '',
            syncedTargets: [],
            selector: []
          }
        }

        // the sibling targets of the same annotation are the ones this target is synced with
        const syncedTargets = annotation.target
          .filter((sibling) => sibling !== target)
          .map((sibling) => ({
            contentUrl: getSource(sibling).id,
            selector: getSelectorValue(sibling)
          }))
          .filter((ref): ref is SyncedTargetRef => Boolean(ref.contentUrl && ref.selector))

        syncMaps[contentUrl][selectorValue].syncedTargets.push(...syncedTargets)
        syncMaps[contentUrl][selectorValue].selector.push(selectorValue)
      })
    })

    set({ syncMaps })
  },
  // assign the rendered html element to each sync target of a given source (contentUrl)
  assignTargetEls: (source: string, panelEl: HTMLElement | null, panelId: string) => {
    // get all targets for this "source" - contentUrl in syncMaps
    const sourceMap = get().syncMaps[source]
    if (!sourceMap || !panelEl) return

    const updatedSourceMap: Record<string, SyncTarget> = {}

    // for each selectorValue -> we locate the target and assign as targetEl -> panelEl.querySelector()
    Object.entries(sourceMap).forEach(([selectorValue, syncTarget]) => {
      const targetEl = panelEl.querySelector<HTMLElement>(selectorValue)
      updatedSourceMap[selectorValue] = { ...syncTarget, targetEl, panelId }
    })

    set({ syncMaps: { ...get().syncMaps, [source]: updatedSourceMap } })
  }
}))
