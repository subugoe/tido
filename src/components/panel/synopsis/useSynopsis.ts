import { useCallback, useRef } from 'react'
import { useSynopsisStore, SyncedTargetRef } from '@/store/SynopsisStore.tsx'
import { getSyncedTargets } from '@/utils/annotations.ts'
import { addAnnotationBaseStyle, addSynopsisHoverStyle, removeSynopsisHoverStyle } from '@/utils/text.ts'

export interface SynopsisLogic {
  onHover: (targetEl: HTMLElement, source: string) => void
  onHoverEnd: () => void
}

// The elements of the given synced targets, wherever they are rendered: a source can be open in
// several panels at once, so every text container showing it contributes its own element.
function resolveSyncedTargetElements(syncedTargets: SyncedTargetRef[]): HTMLElement[] {
  const containers = Array.from(document.querySelectorAll('[data-content-url]'))

  return syncedTargets.flatMap((syncedTarget) => containers
    .filter((container) => container.getAttribute('data-content-url') === syncedTarget.source.id)
    .map((container) => container.querySelector(syncedTarget.selector) as HTMLElement)
    .filter(Boolean)
  )
}

// The synopsis logic a text renderer needs, kept out of the renderer itself.
// The store is read with getState() instead of a subscription: the renderer hands these methods to
// DOM listeners that are attached once, so reading on call keeps them free of stale state - and it
// keeps this hook from re-rendering its component on every store update.
function useSynopsis(): SynopsisLogic {
  // the targets we gave the hover style, so onHoverEnd can drop it from exactly those again
  const hoveredTargetsRef = useRef<HTMLElement[]>([])

  // The hover style is its own class, so adding and dropping it never touches the highlight a
  // target carries as part of the active synopsis connection.
  const onHoverEnd = useCallback(() => {
    hoveredTargetsRef.current.forEach((el) => removeSynopsisHoverStyle(el))
    hoveredTargetsRef.current = []
  }, [])

  // A hovered target highlights the targets it is synced with - in this text and in the other
  // panels' texts alike (without scrolling, unlike an established connection).
  const onHover = useCallback((targetEl: HTMLElement, source: string) => {
    const { syncAnnotationsBySource } = useSynopsisStore.getState()

    // of this source's sync annotations, the ones targeting the hovered element give its synced targets
    const otherSyncedTargets = getSyncedTargets(targetEl, source, syncAnnotationsBySource.get(source) ?? [])
    // not a sync target - nothing is synced with it, so nothing to highlight
    if (otherSyncedTargets.length === 0) return

    // a hover that was never ended (e.g. its target was re-rendered away) must not keep its style
    onHoverEnd()

    const hoveredTargets = [targetEl, ...resolveSyncedTargetElements(otherSyncedTargets)]
    hoveredTargets.forEach((el) => {
      addAnnotationBaseStyle(el)
      addSynopsisHoverStyle(el)
    })

    hoveredTargetsRef.current = hoveredTargets
  }, [onHoverEnd])

  return { onHover, onHoverEnd }
}

export { useSynopsis }
