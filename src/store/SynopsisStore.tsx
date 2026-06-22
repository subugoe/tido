import { create } from 'zustand'
import { apiRequest } from '@/utils/api.ts'
import { getSource } from '@/utils/annotations.ts'
import { useDataStore } from '@/store/DataStore.tsx'

export interface SyncedTargetRef {
  source: AnnotationTargetSource
  selector: string
  targetEl: HTMLElement | null
}

// Payload chosen from a synopsis popover: the synced targets plus the clicked target's
// y-position within its scroll container's visible height (ignoring scroll position), so
// each panel can scroll its own synced target to the same y-position.
export interface SyncTargets {
  yPos: number
  // the target that was clicked to open the synopsis; kept so its active style can be cleared
  // when the next synopsis selection is made
  originTarget: HTMLElement | null
  targets: SyncedTargetRef[]
}

export interface SyncTarget {
  targetEl: HTMLElement | null
  panelId: string
  syncedTargets: SyncedTargetRef[]
  selector: string[]
}

// contentUrl -> selector value -> sync target
type SyncMaps = Record<string, Record<string, SyncTarget>>

interface SynopsisStoreTypes {
  syncMaps: SyncMaps
  // the synced targets of the entry the user chose to open from the synopsis popover
  syncedTargets: SyncTargets
  setSyncMap: (key: string, value: Record<string, SyncTarget>) => void
  removeSyncMap: (key: string) => void
  removeSyncMaps: (contentUrls: string[]) => void
  resetSyncMaps: () => void,
  addSyncTargets: (collectionUrl: string) => Promise<void>,
  appendSyncTargets: (source: string, syncAnnotations: Annotation[], panelEl: HTMLElement | null, panelId: string) => void,
  assignTargetEls: (source: string, panelEl: HTMLElement | null, panelId: string) => void,
  setSyncedTargets: (syncedTargets: SyncTargets) => void,
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
  syncedTargets: { yPos: 0, originTarget: null, targets: [] },
  setSyncedTargets: (syncedTargets) => {
    set({ syncedTargets })
  },
  setSyncMap: (key, value) => {
    set({ syncMaps: { ...get().syncMaps, [key]: value } })
  },
  removeSyncMap: (key) => {
    const { [key]: _removed, ...rest } = get().syncMaps
    set({ syncMaps: rest })
  },
  // Remove all syncMaps entries whose key matches one of the given contentUrls
  // (e.g. the contentUrls rendered in a panel's views that is being closed).
  removeSyncMaps: (contentUrls) => {
    const rest = Object.fromEntries(
      Object.entries(get().syncMaps).filter(([contentUrl]) => !contentUrls.includes(contentUrl))
    )
    set({ syncMaps: rest })
  },
  resetSyncMaps: () => {
    set({ syncMaps: {} })
  },
  addSyncTargets: async (collectionUrl: string) => {
    // check if annotationCollection is provided
    // if not, check for collections key recursively (findAnnotationCollectionUrl) -> in each collection object, check for annotationCollection
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
            source: getSource(sibling),
            selector: getSelectorValue(sibling),
            // elements are not rendered yet at this point; they get assigned later via assignTargetEls
            targetEl: null as HTMLElement | null
          }))
          .filter((ref): ref is SyncedTargetRef => Boolean(ref.source?.id && ref.selector))

        syncMaps[contentUrl][selectorValue].syncedTargets.push(...syncedTargets)
        syncMaps[contentUrl][selectorValue].selector.push(selectorValue)
      })
    })

    set({ syncMaps })
  },
  // Merge the panel collection's synoptic annotations into syncMaps for the given source.
  // The targets are already rendered, so we locate their elements and match them against
  // the existing sync targets (keyed by the element) instead of relying on the selector value.
  appendSyncTargets: (source: string, syncAnnotations: Annotation[], panelEl: HTMLElement | null, panelId: string) => {
    // do not touch syncMaps when there are no synoptic annotations to merge
    if (!panelEl || !syncAnnotations || syncAnnotations.length === 0) return

    const newSyncMaps: SyncMaps = { ...get().syncMaps }
    const sourceMap: Record<string, SyncTarget> = { ...(newSyncMaps[source] ?? {}) }

    let changed = false

    syncAnnotations.forEach((annotation) => {
      annotation.target.forEach((target) => {
        const contentUrl = getSource(target).id
        const selectorValue = getSelectorValue(target)
        // we can only locate targets that belong to the source rendered in this panel
        if (contentUrl !== source || !selectorValue) return

        // 1) locate the targetEl using the target selector
        const targetEl = panelEl.querySelector<HTMLElement>(selectorValue)
        if (!targetEl) return

        // 2) find the existing sync target in the source map by its element
        const existingKey = Object.keys(sourceMap).find((key) => sourceMap[key].targetEl === targetEl)
        const syncTarget: SyncTarget = existingKey
          ? { ...sourceMap[existingKey], selector: [...sourceMap[existingKey].selector], syncedTargets: [...sourceMap[existingKey].syncedTargets] }
          : { targetEl, panelId, syncedTargets: [], selector: [] }

        // 3) append the selector value if it is not already tracked for this element
        if (!syncTarget.selector.includes(selectorValue)) {
          syncTarget.selector.push(selectorValue)
        }

        // for each annotation target: add the sibling targets to syncedTargets if not added yet
        annotation.target
          .filter((sibling) => sibling !== target)
          .map((sibling) => {
            const siblingSource = getSource(sibling)
            const siblingSelector = getSelectorValue(sibling)
            return {
              source: siblingSource,
              selector: siblingSelector,
              // resolve the sibling element from the global syncMaps when its panel is already rendered
              targetEl: newSyncMaps[siblingSource.id]?.[siblingSelector]?.targetEl ?? null
            }
          })
          .filter((ref): ref is SyncedTargetRef => Boolean(ref.source?.id && ref.selector))
          .forEach((ref) => {
            const alreadyAdded = syncTarget.syncedTargets.some(
              (existing) => existing.source.id === ref.source.id &&
                (existing.targetEl === ref.targetEl || existing.selector === ref.selector)
            )
            // The collection which includes refTarget did not include syncAnnotations related to that. However when a new collection is added and includes this target in synopsis, then we should be able to click at this ref and open its synopsis.

            if (!ref.targetEl) {
              const refContainerEl = document.querySelector<HTMLElement>(`[data-content-url="${ref.source.id}"]`)
              const refTargetEl = refContainerEl?.querySelector<HTMLElement>(ref.selector) ?? null
              if (refTargetEl) {
                newSyncMaps[ref.source.id][ref.selector].targetEl = refTargetEl
              }
            }

            if (!alreadyAdded) syncTarget.syncedTargets.push(ref)
          })

        // keep the existing key when matched by element, otherwise key by selector value
        sourceMap[existingKey ?? selectorValue] = syncTarget
        changed = true
      })
    })

    console.log('source map', sourceMap)

    // nothing matched the rendered source, so leave syncMaps untouched
    if (!changed) return

    console.log('source', source)

    newSyncMaps[source] = sourceMap
    set({ syncMaps: newSyncMaps })
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
