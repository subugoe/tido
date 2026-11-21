import { SyncedTargetsMap, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { getSyncedTargets } from '@/utils/annotations.ts'

// The targets the given one is synced with, resolved from the sync annotations of its source -
// grouped by the sync annotation (connection) they come from.
function getOtherSyncedTargets(targetEl: HTMLElement, source: string): SyncedTargetsMap {
  const { syncAnnotationsBySource } = useSynopsisStore.getState()
  return getSyncedTargets(targetEl, source, syncAnnotationsBySource.get(source) ?? [])
}

export { getOtherSyncedTargets }
