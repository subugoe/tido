import { useCallback, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SyncedTargetRef, SynopsisConnection, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { getSelectorValue, getSource, getSyncedTargets } from '@/utils/annotations.ts'
import { getScroller, resolveSyncedTargetElements } from '@/utils/scroller.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  addAnnotationBaseStyle,
  addSynopsisHoverStyle,
  addSynopsisSelectedStyle,
  removeActiveTargetStyle,
  removeSynopsisHoverStyle,
  removeSynopsisSelectedStyle
} from '@/utils/text.ts'


interface SynopsisText {
  text: Element | null
  source: string
}

export interface SynopsisLogic {
  setText: (text: Element | null, source: string) => void
  // the sync targets found in the text handed over - the component that renders it makes them
  // behave like its other targets
  syncTargets: HTMLElement[]
  getOtherSyncedTargets: (targetEl: HTMLElement, source: string) => SyncedTargetRef[]
  handleSynopsisSelection: (connection: SynopsisConnection) => void
  onHover: (targetEl: HTMLElement, source: string) => void
  onHoverEnd: () => void
}

// one instance for every text without sync annotations, so subscribing to them costs no render
const NO_SYNC_ANNOTATIONS: Annotation[] = []
// likewise for a text that has none - the consumer's binding effect is not woken by a new empty array
const NO_SYNC_TARGETS: HTMLElement[] = []

function useSynopsis(): SynopsisLogic {
  const { addSyncedTargets, panelId } = usePanel()
  const activeSynopsisConnection = useSynopsisStore((state) => state.activeSynopsisConnection)
  // the targets we gave the hover style, so onHoverEnd can drop it from exactly those again
  const hoveredTargetsRef = useRef<HTMLElement[]>([])
  const [synopsisText, setSynopsisText] = useState<SynopsisText | null>(null)
  const [syncTargets, setSyncTargets] = useState<HTMLElement[]>(NO_SYNC_TARGETS)

  // The sync annotations of the source this hook was given a text for - they are what turns
  // elements of that text into sync targets.
  const sourceSyncAnnotations = useSynopsisStore(useShallow((state) => synopsisText?.source
    ? state.syncAnnotationsBySource.get(synopsisText.source) ?? NO_SYNC_ANNOTATIONS
    : NO_SYNC_ANNOTATIONS))

  const setText = useCallback((text: Element | null, source: string) => {
    // the same text again keeps the current state, so handing it over repeatedly costs no render
    setSynopsisText((current) =>
      current?.text === text && current?.source === source ? current : { text, source })
  }, [])

  // Which elements of the text are sync targets. What a target does when it is clicked or hovered
  // is the renderer's business - it binds its own listeners to the targets handed back here.
  useEffect(() => {
    if (!synopsisText?.text || sourceSyncAnnotations.length === 0) return

    const { text, source } = synopsisText
    const targetEls: HTMLElement[] = []

    sourceSyncAnnotations.forEach((annotation) => {
      const target = annotation.target.find((t) => getSource(t).id === source)
      const selector = target ? getSelectorValue(target) : null
      if (!selector) return

      text.querySelectorAll(selector).forEach((el) => {
        const targetEl = el as HTMLElement
        // TODO: the synopsis style should be added based on annotation types we allow for default highlighting
        // addHighlightStyle(targetEl)
        addAnnotationBaseStyle(targetEl)
        targetEls.push(targetEl)
      })
    })

    const sortedTargets = [...new Set(targetEls)].sort((a, b) => {
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      return aRect.top - bRect.top || aRect.left - bRect.left
    })

    setSyncTargets(sortedTargets)
    addSyncedTargets(sortedTargets, source)
  }, [synopsisText, sourceSyncAnnotations, addSyncedTargets])

  useEffect(() => {
    if (!synopsisText?.text) return
    const { text, source } = synopsisText

    const { navigatedTarget, otherSyncedTargets, source: connectionSource } = activeSynopsisConnection
    if (!navigatedTarget) return

    // A connection the user scrolled to is highlighted and aligned by the engine already - it is
    // published so the rest of the app follows the scrolling, and all this effect does for it is
    // drop the styles of the connection it replaces (the cleanup of its previous run).
    if (connectionSource === 'scroll') return

    const ownsNavigatedTarget = text.contains(navigatedTarget)

    if (ownsNavigatedTarget) addSynopsisSelectedStyle(navigatedTarget)

    // the connection's targets that live in this text, resolved from their selector
    const ownTargets = otherSyncedTargets
      .filter((syncedTarget) => syncedTarget.source.id === source)
      .map((syncedTarget) => text.querySelector(syncedTarget.selector) as HTMLElement)
      .filter(Boolean)

    ownTargets.forEach((targetEl) => addSynopsisSelectedStyle(targetEl))

    return () => {
      if (ownsNavigatedTarget) {
        removeSynopsisSelectedStyle(navigatedTarget)
        removeActiveTargetStyle(navigatedTarget)
      }
      ownTargets.forEach((targetEl) => removeSynopsisSelectedStyle(targetEl))
    }
  }, [activeSynopsisConnection, synopsisText])

  // The targets the given one is synced with, resolved from the sync annotations of its source.
  const getOtherSyncedTargets = useCallback((targetEl: HTMLElement, source: string) => {
    const { syncAnnotationsBySource } = useSynopsisStore.getState()
    return getSyncedTargets(targetEl, source, syncAnnotationsBySource.get(source) ?? [])
  }, [])

  const handleSynopsisSelection = useCallback((connection: SynopsisConnection) => {
    useSynopsisStore.getState().setActiveSynopsisConnection(connection)
  }, [])

  // The hover style is its own class, so adding and dropping it never touches the highlight a
  // target carries as part of the selected synopsis connection.
  const onHoverEnd = useCallback(() => {
    hoveredTargetsRef.current.forEach((targetEl) => removeSynopsisHoverStyle(targetEl))
    hoveredTargetsRef.current = []
  }, [])

  // Highlight exactly the given elements and remember them, so onHoverEnd drops the style from
  // those again - whether they were highlighted by a hover or by the scroll sync.
  const addSynopsisHoverStyles = useCallback((targetEls: HTMLElement[]) => {
    targetEls.forEach((targetEl) => {
      addAnnotationBaseStyle(targetEl)
      addSynopsisHoverStyle(targetEl)
    })

    hoveredTargetsRef.current = targetEls
  }, [])

  const onHover = useCallback((targetEl: HTMLElement, source: string) => {
    // Entering a target that is part of the current highlight - a target nested in the one already
    // hovered, or the same one entered again - has nothing to add to it. Resolving walks every text
    // of the app, so it is only worth doing for a hover that changes what is highlighted.
    if (hoveredTargetsRef.current.includes(targetEl)) return

    const otherSyncedTargets = getOtherSyncedTargets(targetEl, source)
    if (otherSyncedTargets.length === 0) return

    // remove first the previous hover styles
    onHoverEnd()
    addSynopsisHoverStyles([targetEl, ...resolveSyncedTargetElements(otherSyncedTargets)])
  }, [addSynopsisHoverStyles, getOtherSyncedTargets, onHoverEnd])


  // The text and the targets of the synoptic graph go to the scroller, which owns the scroll
  // listener from there on: a connection reaches from this text into every other panel, so the
  // scrolling it drives cannot be the business of the component that happens to render this one.
  // The registration is replaced on every change and dropped when the text goes away, so a text view
  // that unmounts or swaps its source stops driving connections.
  useEffect(() => {
    const source = synopsisText?.source ?? ''

    getScroller().setSynoptic(panelId, source, synopsisText?.text ?? null, syncTargets)

    return () => getScroller().setSynoptic(panelId, source, null, [])
  }, [panelId, synopsisText, syncTargets])

  return { getOtherSyncedTargets, handleSynopsisSelection, onHover, onHoverEnd, setText, syncTargets }
}

export { useSynopsis }
