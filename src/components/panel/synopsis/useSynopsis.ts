import { useCallback, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { SyncedTargetRef, SynopsisConnection, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { getSelectorValue, getSource, getSyncedTargets } from '@/utils/annotations.ts'
import { findFocusedTarget } from '@/utils/scroller.ts'
import { isProgrammaticScroll } from '@/utils/dom.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { scrollToTargets } from '@/utils/scroll.ts'
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

function resolveSyncedTargetElements(syncedTargets: SyncedTargetRef[]): HTMLElement[] {
  const texts = Array.from(document.querySelectorAll('[data-text-source]'))

  const targetEls = syncedTargets.flatMap((syncedTarget) => texts
    .filter((text) => text.getAttribute('data-text-source') === syncedTarget.source.id)
    .map((text) => text.querySelector(syncedTarget.selector) as HTMLElement)
    .filter(Boolean)
  )

  return [...new Set(targetEls)]
}

function scrollInOtherTexts(targetEls: HTMLElement[], yPos: number, scrolledText: Element) {
  scrollToTargets(targetEls.filter((targetEl) => !scrolledText.contains(targetEl)), yPos)
}

function useSynopsis(): SynopsisLogic {
  const { addSyncedTargets } = usePanel()
  const activeSynopsisConnection = useSynopsisStore((state) => state.activeSynopsisConnection)
  // the targets we gave the hover style, so onHoverEnd can drop it from exactly those again
  const hoveredTargetsRef = useRef<HTMLElement[]>([])
  const [synopsisText, setSynopsisText] = useState<SynopsisText | null>(null)
  const [syncTargets, setSyncTargets] = useState<HTMLElement[]>(NO_SYNC_TARGETS)
  const syncTargetElsRef = useRef<{ text: Element, syncAnnotations: Annotation[], targetEls: HTMLElement[] } | null>(null)

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
    targetEls.forEach((targetEl) => {
      addAnnotationBaseStyle(targetEl)
      addSynopsisHoverStyle(targetEl)
    })

    hoveredTargetsRef.current = targetEls
  }, [])

  const onHover = useCallback((targetEl: HTMLElement, source: string) => {
    const otherSyncedTargets = getOtherSyncedTargets(targetEl, source)
    if (otherSyncedTargets.length === 0) return

    // remove first the previous hover styles
    onHoverEnd()
    addSynopsisHoverStyles([targetEl, ...resolveSyncedTargetElements(otherSyncedTargets)])
  }, [addSynopsisHoverStyles, getOtherSyncedTargets])


  // The sync target closest to the top of the scrolled text becomes the active connection, and the
  // texts it is synced with are moved to their side of it.
  const syncScrolledConnection = useCallback((text: Element, source: string, scrollContainer: HTMLElement) => {
    const focusedTarget = findFocusedTarget(scrollContainer, getSourceTargetElements(text, source))
    if (!focusedTarget) return

    const syncedTargets = getOtherSyncedTargets(focusedTarget, source)
    if (syncedTargets.length === 0) return

    const yPos = focusedTarget.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top

    useSynopsisStore.getState().setActiveSynopsisConnection({
      navigatedTarget: focusedTarget,
      otherSyncedTargets: syncedTargets,
      yPos,
      source: 'scroll'
    })

    scrollInOtherTexts(resolveSyncedTargetElements(syncedTargets), yPos, text)
  }, [getOtherSyncedTargets, getSourceTargetElements])

  // Bound here rather than by the component that renders the text, because the listener has to hold
  // the text it belongs to and this is where that text arrives: the effect reruns with every text
  // handed over, so the listener is replaced by one that closes over the current one. By the time it
  // runs the text is in the document - setText is called from an effect of the render before this.
  useEffect(() => {
    if (!synopsisText?.text) return
    const { text, source } = synopsisText

    const scrollContainer = text.closest('[data-text-container]') as HTMLElement | null
    if (!scrollContainer) return

    const onScroll = () => {
      // ours, so a scroll we caused does not sync the panels back on top of it
      if (isProgrammaticScroll(scrollContainer)) return
      syncScrolledConnection(text, source, scrollContainer)
    }

    scrollContainer.addEventListener('scroll', onScroll, { passive: true })
    return () => scrollContainer.removeEventListener('scroll', onScroll)
  }, [synopsisText, syncScrolledConnection])

  return { getOtherSyncedTargets, handleSynopsisSelection, onHover, onHoverEnd, setText, syncTargets }
}

export { useSynopsis }
