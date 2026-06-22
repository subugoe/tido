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

// contentUrl -> sync targets (one entry per known target; a clicked target is identified by its targetEl)
type SyncMaps = Record<string, SyncTarget[]>

interface SynopsisStoreTypes {
  syncMaps: SyncMaps
  // the synced targets of the entry the user chose to open from the synopsis popover
  syncedTargets: SyncTargets
  setSyncMap: (key: string, value: SyncTarget[]) => void
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
    // for each annotation, go through each target and build one SyncTarget per target.
    // {contentUrl: [{targetEl: null, panelId: '', syncedTargets:[], selector: [selectorValue]}]}
    // The targets are not rendered yet (targetEl is null), so we match an existing entry by its
    // selector here; once rendered, lookups happen by targetEl.
    const syncMaps: SyncMaps = { ...get().syncMaps }

    syncAnnotations.forEach((annotation) => {
      annotation.target.forEach((target) => {
        const contentUrl = getSource(target).id
        const selectorValue = getSelectorValue(target)
        if (!contentUrl || !selectorValue) return

        if (!syncMaps[contentUrl]) syncMaps[contentUrl] = []
        let syncTarget = syncMaps[contentUrl].find((st) => st.selector.includes(selectorValue))
        if (!syncTarget) {
          syncTarget = { targetEl: null, panelId: '', syncedTargets: [], selector: [selectorValue] }
          syncMaps[contentUrl].push(syncTarget)
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

        syncTarget.syncedTargets.push(...syncedTargets)
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
    const sourceList: SyncTarget[] = [...(newSyncMaps[source] ?? [])]

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

        // 2) find the existing sync target in the source list by its element
        const existingIndex = sourceList.findIndex((st) => st.targetEl === targetEl)
        const syncTarget: SyncTarget = existingIndex >= 0
          ? { ...sourceList[existingIndex], selector: [...sourceList[existingIndex].selector], syncedTargets: [...sourceList[existingIndex].syncedTargets] }
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
            // resolve the sibling element from its rendered container when its panel is already rendered
            const siblingContainerEl = siblingSelector ? document.querySelector<HTMLElement>(`[data-content-url="${siblingSource.id}"]`) : null
            return {
              source: siblingSource,
              selector: siblingSelector,
              targetEl: siblingContainerEl?.querySelector<HTMLElement>(siblingSelector) ?? null
            }
          })
          .filter((ref): ref is SyncedTargetRef => Boolean(ref.source?.id && ref.selector))
          .forEach((ref) => {
            const alreadyAdded = syncTarget.syncedTargets.some(
              (existing) => existing.source.id === ref.source.id &&
                (existing.targetEl === ref.targetEl || existing.selector === ref.selector)
            )
            // The collection which includes refTarget did not include syncAnnotations related to that. However when a new collection is added and includes this target in synopsis, then we should be able to click at this ref and open its synopsis.
            // Bind the located element to the sibling's own sync target so it becomes clickable.
            // That entry was seeded by addSyncTargets without a targetEl, so we match it by element or selector.
            if (ref.targetEl) {
              const refSyncTarget = newSyncMaps[ref.source.id]?.find((st) => st.targetEl === ref.targetEl || st.selector.includes(ref.selector))
              if (refSyncTarget) refSyncTarget.targetEl = ref.targetEl
            }

            if (!alreadyAdded) syncTarget.syncedTargets.push(ref)
          })

        // replace the matched entry, otherwise append the new one
        if (existingIndex >= 0) sourceList[existingIndex] = syncTarget
        else sourceList.push(syncTarget)
        changed = true
      })
    })

    // nothing matched the rendered source, so leave syncMaps untouched
    if (!changed) return

    newSyncMaps[source] = sourceList
    set({ syncMaps: newSyncMaps })
  },
  // assign the rendered html element to each sync target of a given source (contentUrl)
  assignTargetEls: (source: string, panelEl: HTMLElement | null, panelId: string) => {
    // get all targets for this "source" - contentUrl in syncMaps
    const sourceList = get().syncMaps[source]
    if (!sourceList || !panelEl) return

    // for each sync target -> locate the element via the first tracked selector that resolves in this panel
    const updatedList = sourceList.map((syncTarget) => {
      let targetEl: HTMLElement | null = null
      for (const selectorValue of syncTarget.selector) {
        targetEl = panelEl.querySelector<HTMLElement>(selectorValue)
        if (targetEl) break
      }
      return { ...syncTarget, targetEl, panelId }
    })

    set({ syncMaps: { ...get().syncMaps, [source]: updatedList } })
  }
}))
