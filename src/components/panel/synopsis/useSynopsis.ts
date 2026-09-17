import { useCallback, useEffect, useRef, useState } from 'react'
import { SyncedTargetRef, SynopsisConnection, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { getSelectorValue, getSource, getSyncedTargets } from '@/utils/annotations.ts'
import { findFocusedTarget } from '@/utils/scroller.ts'
import { markProgrammaticScroll } from '@/utils/dom.ts'
import {
  addAnnotationBaseStyle,
  addSynopsisHoverStyle,
  addSynopsisSelectedStyle,
  removeActiveTargetStyle,
  removeSynopsisHoverStyle,
  removeSynopsisSelectedStyle
} from '@/utils/text.ts'

// The text of the component using the hook, together with the content url it renders - the two
// always arrive together so the targets are never looked up in a text of another source.
interface SynopsisText {
  text: Element | null
  source: string
}

export interface SynopsisLogic {
  setText: (text: Element | null, source: string) => void
  handleScroll: (source: string) => void
  getOtherSyncedTargets: (targetEl: HTMLElement, source: string) => SyncedTargetRef[]
  handleSynopsisSelection: (connection: SynopsisConnection) => void
  onHover: (targetEl: HTMLElement, source: string) => void
  onHoverEnd: () => void
}

function resolveSyncedTargetElements(syncedTargets: SyncedTargetRef[]): HTMLElement[] {
  const texts = Array.from(document.querySelectorAll('[data-text-source]'))

  const targetEls = syncedTargets.flatMap((syncedTarget) => texts
    .filter((text) => text.getAttribute('data-text-source') === syncedTarget.source.id)
    .map((text) => text.querySelector(syncedTarget.selector) as HTMLElement)
    .filter(Boolean)
  )

  return [...new Set(targetEls)]
}

function scrollToTargets(targetEls: HTMLElement[], yPos: number) {
  targetEls.forEach((targetEl) => {
    const scrollContainer = targetEl.closest('[data-text-container]') as HTMLElement | null
    if (!scrollContainer) return

    const currentY = targetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
    const desiredScrollTop = scrollContainer.scrollTop + currentY - yPos
    const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight

    // ours, so the text's own scroll listener does not take it for the user's scrolling and sync
    // the panels back on top of it
    markProgrammaticScroll(scrollContainer)
    scrollContainer.scrollTo({ top: Math.max(0, Math.min(desiredScrollTop, maxScrollTop)), behavior: 'smooth' })
  })
}

function scrollInOtherTexts(targetEls: HTMLElement[], yPos: number, scrolledText: Element) {
  scrollToTargets(targetEls.filter((targetEl) => !scrolledText.contains(targetEl)), yPos)
}

function useSynopsis(): SynopsisLogic {
  const activeSynopsisConnection = useSynopsisStore((state) => state.activeSynopsisConnection)
  // the targets we gave the hover style, so onHoverEnd can drop it from exactly those again
  const hoveredTargetsRef = useRef<HTMLElement[]>([])
  const [synopsisText, setSynopsisText] = useState<SynopsisText | null>(null)
  const synopsisTextRef = useRef<SynopsisText | null>(null)
  const syncTargetElsRef = useRef<{ text: Element, syncAnnotations: Annotation[], targetEls: HTMLElement[] } | null>(null)

  const setText = useCallback((text: Element | null, source: string) => {
    synopsisTextRef.current = { text, source }
    // the same text again keeps the current state, so handing it over repeatedly costs no render
    setSynopsisText((current) =>
      current?.text === text && current?.source === source ? current : { text, source })
  }, [])

  // The elements in the given text that the sync annotations of its source target - the candidates
  // the scroll position is matched against.
  const getSourceTargetElements = useCallback((text: Element, source: string) => {
    const syncAnnotations = useSynopsisStore.getState().syncAnnotationsBySource.get(source) ?? []

    const cached = syncTargetElsRef.current
    if (cached && cached.text === text && cached.syncAnnotations === syncAnnotations) return cached.targetEls

    const targetEls = syncAnnotations.flatMap((annotation) => {
      const target = annotation.target.find((t) => getSource(t).id === source)
      const selector = target ? getSelectorValue(target) : null
      return selector ? Array.from(text.querySelectorAll(selector)) as HTMLElement[] : []
    })

    syncTargetElsRef.current = { text, syncAnnotations, targetEls: [...new Set(targetEls)] }
    return syncTargetElsRef.current.targetEls
  }, [])

  useEffect(() => {
    if (!synopsisText?.text) return
    const { text, source } = synopsisText

    const { navigatedTarget, otherSyncedTargets, yPos, source: connectionSource } = activeSynopsisConnection
    if (!navigatedTarget) return

    // A connection the user scrolled to is highlighted and aligned by handleScroll already - it is
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
    scrollToTargets(ownTargets, yPos)

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
    // a highlight that was never ended (e.g. its target was re-rendered away) must not stay
    onHoverEnd()

    targetEls.forEach((targetEl) => {
      addAnnotationBaseStyle(targetEl)
      addSynopsisHoverStyle(targetEl)
    })

    hoveredTargetsRef.current = targetEls
  }, [onHoverEnd])

  const onHover = useCallback((targetEl: HTMLElement, source: string) => {
    const otherSyncedTargets = getOtherSyncedTargets(targetEl, source)
    // not a sync target - nothing is synced with it, so nothing to highlight
    if (otherSyncedTargets.length === 0) return

    addSynopsisHoverStyles([targetEl, ...resolveSyncedTargetElements(otherSyncedTargets)])
  }, [addSynopsisHoverStyles, getOtherSyncedTargets])


  const handleScroll = useCallback((source: string) => {
    const text = synopsisTextRef.current?.text
    if (!text) return

    const scrollContainer = text.closest('[data-text-container]') as HTMLElement | null
    if (!scrollContainer) return

    const focusedTarget = findFocusedTarget(scrollContainer, getSourceTargetElements(text, source))
    if (!focusedTarget) return

    const syncedTargets = getOtherSyncedTargets(focusedTarget, source)
    if (syncedTargets.length === 0) return

    const yPos = focusedTarget.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top

    const connection = {
      navigatedTarget: focusedTarget,
      otherSyncedTargets: syncedTargets,
      yPos,
      source: 'scroll'
    }
    useSynopsisStore.getState().setActiveSynopsisConnection(connection)

    const syncedTargetEls = resolveSyncedTargetElements(syncedTargets)
    scrollInOtherTexts(syncedTargetEls, yPos, text)
  }, [addSynopsisHoverStyles, getOtherSyncedTargets, getSourceTargetElements, handleSynopsisSelection])

  return { getOtherSyncedTargets, handleScroll, handleSynopsisSelection, onHover, onHoverEnd, setText }
}

export { useSynopsis }
