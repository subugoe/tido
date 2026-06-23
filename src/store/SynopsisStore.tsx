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

// Per-panel info for a sync target. The same content can be open in several panels at
// once, so each panel keeps its own rendered element (and the selectors that resolved
// it) plus the synced targets resolved for that panel, keyed by panelId in SyncTarget.panels.
export interface SyncTargetPanel {
  targetEl: HTMLElement | null
  selector: string[]
  syncedTargets: SyncedTargetRef[]
}

export interface SyncTarget {
  // per-panel info keyed by panelId; UNRENDERED_PANEL ('') holds entries seeded before
  // any panel rendered them (targetEl still null)
  panels: Record<string, SyncTargetPanel>
}

// placeholder panel key for targets seeded (by addSyncTargets) before any panel renders them
const UNRENDERED_PANEL = ''

// a sync target tracks a given selector value in one of its panels
function hasSelector(syncTarget: SyncTarget, selectorValue: string): boolean {
  return Object.values(syncTarget.panels).some((p) => p.selector.includes(selectorValue))
}

// a sync target has the given rendered element in one of its panels
function hasTargetEl(syncTarget: SyncTarget, targetEl: HTMLElement): boolean {
  return Object.values(syncTarget.panels).some((p) => p.targetEl === targetEl)
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
        let syncTarget = syncMaps[contentUrl].find((st) => hasSelector(st, selectorValue))
        if (!syncTarget) {
          // not rendered yet: seed under the placeholder panel key with the known selector
          syncTarget = { panels: { [UNRENDERED_PANEL]: { targetEl: null, selector: [selectorValue], syncedTargets: [] } } }
          syncMaps[contentUrl].push(syncTarget)
        }
        // at seed time nothing is rendered, so the synced targets live under the placeholder panel
        const seedPanel = syncTarget.panels[UNRENDERED_PANEL]
          ?? (syncTarget.panels[UNRENDERED_PANEL] = { targetEl: null, selector: [], syncedTargets: [] })

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

        seedPanel.syncedTargets.push(...syncedTargets)
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

        // 2) find the existing sync target representing this logical target. Match by any
        //    tracked selector (or element) across panels, so several panels showing the same
        //    content share one entry and only differ by their per-panel rendered element.
        const existingIndex = sourceList.findIndex((st) => hasSelector(st, selectorValue) || hasTargetEl(st, targetEl))
        const existing = existingIndex >= 0 ? sourceList[existingIndex] : null

        // copy the existing panels (drop the unrendered placeholder now that a panel renders it)
        const panels: Record<string, SyncTargetPanel> = {}
        for (const [pid, ref] of Object.entries(existing?.panels ?? {})) {
          if (pid === UNRENDERED_PANEL) continue
          panels[pid] = { targetEl: ref.targetEl, selector: [...ref.selector], syncedTargets: [...ref.syncedTargets] }
        }

        const seedPanel = existing?.panels[UNRENDERED_PANEL]

        // 3) merge this panel's rendered element, selector and synced targets into its own
        //    panel entry, carrying over anything previously seeded under the placeholder key
        const panelSelectors = panels[panelId]?.selector ?? (seedPanel ? [...seedPanel.selector] : [])
        if (!panelSelectors.includes(selectorValue)) panelSelectors.push(selectorValue)

        const panelSyncedTargets = panels[panelId]?.syncedTargets ?? (seedPanel ? [...seedPanel.syncedTargets] : [])
        panels[panelId] = { targetEl, selector: panelSelectors, syncedTargets: panelSyncedTargets }

        const syncTarget: SyncTarget = { panels }
        // synced targets are tracked per panel; collect them into this panel's entry
        const currentPanel = panels[panelId]

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
            const alreadyAdded = currentPanel.syncedTargets.some(
              (existing) => existing.source.id === ref.source.id &&
                (existing.targetEl === ref.targetEl || existing.selector === ref.selector)
            )
            // The collection which includes refTarget did not include syncAnnotations related to that. However when a new collection is added and includes this target in synopsis, then we should be able to click at this ref and open its synopsis.
            // Bind the located element to the sibling's own sync target so it becomes clickable.
            // That entry was seeded by addSyncTargets without a targetEl, so we match it by element or selector.
            if (ref.targetEl) {
              const refSyncTarget = newSyncMaps[ref.source.id]?.find((st) => hasTargetEl(st, ref.targetEl!) || hasSelector(st, ref.selector))
              if (refSyncTarget) {
                // bind under the sibling's own panel (resolved from the DOM), keeping its selector
                const refPanelId = ref.targetEl.closest('[data-panel-id]')?.getAttribute('data-panel-id') ?? UNRENDERED_PANEL
                const refPanel = refSyncTarget.panels[refPanelId]
                const refPanelSelectors = refPanel?.selector ?? []
                if (!refPanelSelectors.includes(ref.selector)) refPanelSelectors.push(ref.selector)
                refSyncTarget.panels = {
                  ...refSyncTarget.panels,
                  [refPanelId]: { targetEl: ref.targetEl, selector: refPanelSelectors, syncedTargets: refPanel?.syncedTargets ?? [] },
                }
              }
            }

            if (!alreadyAdded) currentPanel.syncedTargets.push(ref)
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

    // for each sync target -> locate its element in this panel using any of its tracked
    // selectors (collected across panels, incl. the unrendered seed), then record the
    // rendered element under this panel's own key without disturbing other panels' entries
    const updatedList = sourceList.map((syncTarget) => {
      const selectors = Array.from(new Set(Object.values(syncTarget.panels).flatMap((p) => p.selector)))

      let targetEl: HTMLElement | null = null
      const matchedSelectors: string[] = []
      for (const selectorValue of selectors) {
        const el = panelEl.querySelector<HTMLElement>(selectorValue)
        if (!el) continue
        if (!targetEl) targetEl = el
        matchedSelectors.push(selectorValue)
      }

      // this panel does not render this target -> leave its panels untouched
      if (!targetEl) return syncTarget

      // carry over the synced targets already known for this panel (or seeded under the placeholder)
      const seedPanel = syncTarget.panels[UNRENDERED_PANEL]
      const syncedTargets = syncTarget.panels[panelId]?.syncedTargets ?? (seedPanel ? [...seedPanel.syncedTargets] : [])

      // drop the placeholder seed now that a real panel renders this target
      const { [UNRENDERED_PANEL]: _seed, ...renderedPanels } = syncTarget.panels
      return {
        ...syncTarget,
        panels: { ...renderedPanels, [panelId]: { targetEl, selector: matchedSelectors, syncedTargets } },
      }
    })

    set({ syncMaps: { ...get().syncMaps, [source]: updatedList } })
  }
}))
