import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useAnnotations, getVisibleContentUrls } from '@/contexts/AnnotationsContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getFilteredAnnotations, getSource } from '@/utils/annotations.ts'
import { getAnnotationTargets, getAnnotationType } from '@/utils/annotation-data.ts'
import { AlignedEntry, AlignedSlot, layoutAligned, measureAligned } from '@/utils/aligned-layout.ts'
import { isProgrammaticScroll, markProgrammaticScroll } from '@/utils/dom.ts'
import { SYNC_SCROLL_THRESHOLD_TOP } from '@/utils/scroller.ts'
import * as wb from '@/utils/workbench.ts'
import { SelectedAnnotation } from '@/types'
import AlignedSlotView, { AlignedColumnInfo } from '@/components/panel/annotations/sidebar/aligned/AlignedSlotView.tsx'
import Workbench, { WorkbenchActions } from '@/components/panel/annotations/sidebar/aligned/Workbench.tsx'
import { WorkbenchRowContext } from '@/components/panel/annotations/sidebar/aligned/WorkbenchRow.tsx'

interface Layout {
  slots: AlignedSlot[]
  innerHeight: number
  // identifies the layout, so a measurement that changes nothing does not render again
  key: string
}

function getLayoutKey(slots: AlignedSlot[], innerHeight: number) {
  return innerHeight + ';' + slots.map((s) => s.y + ':' + s.members.map((m) => m.contentUrl + '|' + m.annotation.id).join(',')).join(';')
}

interface Props {
  // the element the workbench is rendered into - over the list, outside of what scrolls
  overlayHost: HTMLElement | null
}

// The aligned annotations column: one entry per annotation at the height of its target, in the
// coordinates of the target's own text. The layout is only recomputed when the layout of a text or
// the sidebar changes - not on scrolling and not on a selection. The sidebar follows the leading
// text (see Scroller). Selected annotations open as cards on the workbench over the column.
const AlignAnnotationsList: FC<Props> = ({ overlayHost }) => {
  const { panelId, panelState, annotations, matchedAnnotationsMaps, selectedAnnotation, setSelectedAnnotation, getScroller } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { setAlignmentLoading } = useAnnotations()
  const [layout, setLayout] = useState<Layout | null>(null)
  const frame = useRef(0)

  const panelViews = panelState?.panelViews
  const contents = panelState?.item?.contents
  const tooltipTypes = annotationsConfig?.tooltipTypes
  const crossRefType = annotationsConfig?.crossRefContentType

  // The visible texts in panel order with the annotations shown for each of them.
  const textAnnotations = useMemo(() => getVisibleContentUrls(panelViews, contents).map((contentUrl) => {
    const map = matchedAnnotationsMaps[contentUrl]
    const annotations = map
      ? getFilteredAnnotations(map).filter((a) => !(tooltipTypes ?? []).includes(getAnnotationType(a)))
      : []
    return { contentUrl, annotations }
  }), [panelViews, contents, matchedAnnotationsMaps, tooltipTypes])

  // The sub-annotations of an annotation are the ones targeting its body - taken the way the
  // annotation card lists them, without cross references and tooltip types.
  const { annotationsById, childrenById } = useMemo(() => {
    const annotationsById = new Map<string, Annotation>()
    const childrenById = new Map<string, Annotation[]>()
    ;(annotations ?? []).forEach((annotation) => annotationsById.set(annotation.id, annotation))
    ;(annotations ?? []).forEach((annotation) => {
      const type = getAnnotationType(annotation)
      if (type === 'CrossRef' || type === crossRefType || (tooltipTypes ?? []).includes(type)) return
      const target = getAnnotationTargets(annotation)[0]
      const parentId = target ? getSource(target).id : null
      if (!parentId || !annotationsById.has(parentId)) return
      childrenById.set(parentId, [...(childrenById.get(parentId) ?? []), annotation])
    })
    return { annotationsById, childrenById }
  }, [annotations, crossRefType, tooltipTypes])

  const column = useMemo<AlignedColumnInfo>(() => ({
    subAnnotationCounts: new Map([...childrenById].map(([id, children]) => [id, children.length])),
    showOrigin: textAnnotations.length > 1
  }), [childrenById, textAnnotations.length])

  useEffect(() => {
    const scroller = getScroller()
    scroller.startSync()
    return () => scroller.stopSync()
  }, [])

  // The leading text starts as the first visible one and falls back to it when it is hidden.
  useEffect(() => {
    const scroller = getScroller()
    const urls = textAnnotations.map((t) => t.contentUrl)
    const lead = scroller.getLead()
    if (!lead || !urls.includes(lead)) scroller.setLead(urls[0] ?? null)
  }, [textAnnotations])

  const measure = useCallback(() => {
    const scroller = getScroller()
    const sidebar = scroller.getSidebar()
    if (!sidebar) return

    const texts = textAnnotations
      .map((t) => ({ ...t, container: scroller.getText(t.contentUrl) }))
      .filter((t) => t.container?.isConnected)

    const { entries, innerHeight } = measureAligned(texts, sidebar)
    const slots = layoutAligned(entries)
    const key = getLayoutKey(slots, innerHeight)

    setLayout((prev) => prev?.key === key ? prev : { slots, innerHeight, key })
    setAlignmentLoading(false)
  }, [textAnnotations])

  const scheduleMeasure = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(measure)
  }, [measure])

  // Recompute on layout changes only: a text or the sidebar resized (panel or sidebar width, text
  // content loaded, a view toggled), fonts loaded, the filters changed.
  useEffect(() => {
    const scroller = getScroller()
    const observer = new ResizeObserver(scheduleMeasure)

    const sidebar = scroller.getSidebar()
    if (sidebar) observer.observe(sidebar)

    textAnnotations.forEach(({ contentUrl }) => {
      const container = scroller.getText(contentUrl)
      if (!container) return
      observer.observe(container)
      // the container keeps its size when its content grows, its children do not
      Array.from(container.children).forEach((child) => observer.observe(child))
    })

    document.fonts?.ready.then(scheduleMeasure)
    scheduleMeasure()

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame.current)
    }
  }, [scheduleMeasure, textAnnotations])

  // A new layout may have changed the sidebar's scroll range, so it takes up the leading text's
  // scrollTop again - unless it is on its way there already.
  useEffect(() => {
    const sidebar = getScroller().getSidebar()
    if (!layout || !sidebar || isProgrammaticScroll(sidebar)) return
    getScroller().syncSidebarToLead()
  }, [layout])

  const layoutReady = layout !== null

  // The entries of the column by annotation id - what the workbench opens cards for.
  const entriesById = useMemo(() => {
    const map = new Map<string, AlignedEntry>()
    layout?.slots.forEach((slot) => slot.members.forEach((entry) => map.set(entry.annotation.id, entry)))
    return map
  }, [layout])

  // A selection never changes the layout. It only decides which text the sidebar is read against.
  useEffect(() => {
    if (!selectedAnnotation?.annotation || !layout) return
    const scroller = getScroller()
    const { origin, annotation, contentUrl } = selectedAnnotation

    // Selected in the sidebar or in a text: that text becomes the leading one and the sidebar
    // travels to its scrollTop, which puts the entry at the height of its target.
    if ((origin === 'annotation' || origin === 'text') && contentUrl && scroller.getText(contentUrl)) {
      scroller.setLead(contentUrl)
      scroller.syncSidebarToLead('smooth')
      return
    }

    // From elsewhere - config, bookmark, cross reference: the text is scrolled to the target and
    // leads, so the sidebar follows it there.
    const entry = entriesById.get(annotation.id)
    const text = entry ? scroller.getText(entry.contentUrl) : null
    if (!entry || !text) return

    scroller.setLead(entry.contentUrl)
    const maxScrollTop = text.scrollHeight - text.clientHeight
    const top = Math.max(0, Math.min(entry.textTop - text.clientHeight * SYNC_SCROLL_THRESHOLD_TOP, maxScrollTop))
    if (Math.abs(top - text.scrollTop) < 1) {
      scroller.syncSidebarToLead('smooth')
      return
    }
    markProgrammaticScroll(text)
    text.scrollTo({ top, behavior: 'smooth' })
  }, [selectedAnnotation, layoutReady])

  // ---- Workbench -------------------------------------------------------------------------------
  // The stack of cards. Its state is mirrored in a ref, so a handler can work out the next state and
  // act on it (focus, selection) in one go.
  const [workbench, setWorkbenchState] = useState<wb.WorkbenchState>(wb.EMPTY_WORKBENCH)
  const workbenchRef = useRef(workbench)
  const [focusRequest, setFocusRequest] = useState<{ key: string, n: number } | null>(null)
  // the element each card was opened from, so the focus can go back there when it closes
  const triggers = useRef(new Map<string, HTMLElement>())
  const pendingTrigger = useRef<HTMLElement | null>(null)

  const setWorkbench = useCallback((next: wb.WorkbenchState) => {
    workbenchRef.current = next
    setWorkbenchState(next)
    return next
  }, [])

  const requestFocus = useCallback((key: string) => setFocusRequest((prev) => ({ key, n: (prev?.n ?? 0) + 1 })), [])

  const rememberTrigger = (key: string, trigger: HTMLElement | null) => {
    if (trigger && !triggers.current.has(key)) triggers.current.set(key, trigger)
  }

  const parentOf = useCallback((id: string) => {
    const annotation = annotationsById.get(id)
    const target = annotation ? getAnnotationTargets(annotation)[0] : null
    const source = target ? getSource(target).id : null
    return source && annotationsById.has(source) ? source : null
  }, [annotationsById])

  const select = useCallback((annotation: Annotation | null, contentUrl?: string) => {
    if (!annotation) {
      setSelectedAnnotation(null)
      return
    }
    getScroller().setOriginSelection('annotation')
    setSelectedAnnotation({ annotation, origin: 'annotation', contentUrl } as SelectedAnnotation)
  }, [])

  // The annotation a card stands for while it is the active one: the deepest open sub-annotation of
  // its first expanded row, else that row. A sub-annotation is selected with the annotation it
  // hangs off as its source, the way the note of that annotation selects it.
  const selectCardOf = useCallback((state: wb.WorkbenchState) => {
    const card = state.cards.find((c) => c.key === state.activeKey)
    const rowId = card?.expandedRows[0]
    if (!card || !rowId) {
      select(null)
      return
    }
    const path = card.subPaths[rowId] ?? []
    if (path.length === 0) {
      select(annotationsById.get(rowId) ?? null, entriesById.get(rowId)?.contentUrl)
      return
    }
    const id = path[path.length - 1]
    select(annotationsById.get(id) ?? null, path.length > 1 ? path[path.length - 2] : rowId)
  }, [annotationsById, entriesById, select])

  // Opening follows the selection: whatever selects an annotation of the column - its entry, its
  // target in the text, the popover, the config or a bookmark - puts its card on top. A selected
  // sub-annotation opens the card of the annotation it hangs off, down to it.
  useEffect(() => {
    const annotation = selectedAnnotation?.annotation
    if (!annotation || !layout) return

    const chain = wb.getAncestorChain(annotation.id, parentOf, (id) => entriesById.has(id))
    if (chain.length === 0) return

    const [root, ...path] = chain
    let next = wb.openCard(workbenchRef.current, [root], [root])
    if (path.length > 0) next = wb.setSubPath(next, next.activeKey, root, path)
    setWorkbench(next)

    rememberTrigger(next.activeKey, pendingTrigger.current)
    pendingTrigger.current = null
    // the focus moves along only for what the user did - not for a selection made on load
    if (selectedAnnotation.origin === 'annotation' || selectedAnnotation.origin === 'text') requestFocus(next.activeKey)
  }, [selectedAnnotation, layoutReady])

  // The list behind the workbench stands still while it is open.
  const workbenchOpen = workbench.cards.length > 0
  useEffect(() => {
    getScroller().setFrozen(workbenchOpen)
  }, [workbenchOpen])

  // After cards are gone the focus goes to the card now on top, or back to where the last one was
  // opened from. When the active card went, the card now active decides the selection.
  const afterClose = (closedKeys: string[], next: wb.WorkbenchState, activeClosed: boolean) => {
    if (next.cards.length === 0) {
      const trigger = closedKeys.map((key) => triggers.current.get(key)).find((el) => el?.isConnected)
      requestAnimationFrame(() => trigger?.focus())
    } else {
      requestFocus(next.cards[0].key)
    }
    closedKeys.forEach((key) => triggers.current.delete(key))
    if (activeClosed) selectCardOf(next)
  }

  const workbenchActions: WorkbenchActions = {
    activate: (key) => {
      selectCardOf(setWorkbench(wb.setActive(workbenchRef.current, key)))
    },
    close: (key) => {
      const prev = workbenchRef.current
      afterClose([key], setWorkbench(wb.closeCard(prev, key)), prev.activeKey === key)
    },
    closeAll: () => {
      const { cards, activeKey } = workbenchRef.current
      const keys = cards.map((c) => c.key)
      // the focus goes back to where the active card was opened from
      const ordered = activeKey ? [activeKey, ...keys.filter((k) => k !== activeKey)] : keys
      afterClose(ordered, setWorkbench(wb.closeAll()), true)
    },
    collapseAll: () => {
      setWorkbench(wb.collapseAll(workbenchRef.current))
    },
    toggleCollapsed: (key) => {
      setWorkbench(wb.toggleCollapsed(workbenchRef.current, key))
    },
    toggleRow: (key, annotationId) => {
      const card = workbenchRef.current.cards.find((c) => c.key === key)
      if (card?.expandedRows.includes(annotationId)) {
        setWorkbench(wb.toggleRow(workbenchRef.current, key, annotationId))
        return
      }
      // expanding a row selects its annotation, which expands it through the selection
      select(annotationsById.get(annotationId) ?? null, entriesById.get(annotationId)?.contentUrl)
    },
    setSubPath: (key, rowId, path) => {
      selectCardOf(setWorkbench(wb.setSubPath(wb.setActive(workbenchRef.current, key), key, rowId, path)))
    },
    escape: () => {
      const prev = workbenchRef.current
      const next = setWorkbench(wb.closeDeepest(prev))
      const closed = prev.cards.filter((c) => !next.cards.some((n) => n.key === c.key)).map((c) => c.key)
      if (closed.length > 0) {
        afterClose(closed, next, true)
        return
      }
      selectCardOf(next)
      // the focus may have been inside what just closed - it goes to the row that was collapsed
      const card = prev.cards.find((c) => c.key === prev.activeKey)
      const nextCard = next.cards.find((c) => c.key === next.activeKey)
      const collapsedId = card && nextCard && Object.keys(card.subPaths)
        .map((rowId) => card.subPaths[rowId][(nextCard.subPaths[rowId] ?? []).length])
        .find(Boolean)
      if (!collapsedId) return
      requestAnimationFrame(() => {
        const button = overlayHost?.querySelector(`[data-workbench-row="${CSS.escape(collapsedId)}"] > button`) as HTMLElement | null
        button?.focus()
      })
    }
  }

  const rowContext = useMemo<WorkbenchRowContext>(() => ({
    childrenOf: (id) => childrenById.get(id) ?? [],
    showOrigin: column.showOrigin,
    textIndexOf: (id) => entriesById.get(id)?.textIndex
  }), [childrenById, column.showOrigin, entriesById])

  // A click on the sidebar outside of an entry deselects.
  useEffect(() => {
    const sidebar = document.getElementById(panelId)?.querySelector('[data-sidebar-scroll-container]') as HTMLElement | null
    if (!sidebar) return
    const controller = new AbortController()

    sidebar.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).closest('[data-annotation], [data-annotation-group]')) return
      setSelectedAnnotation(null)
    }, { signal: controller.signal })

    return () => controller.abort()
  }, [panelId])

  // An entry opens its card - also when it is selected already, as its card may have been closed.
  const onSelect = useCallback((entry: AlignedEntry, trigger: HTMLElement) => {
    if (selectedAnnotation?.annotation?.id === entry.annotation.id) {
      const next = setWorkbench(wb.openCard(workbenchRef.current, [entry.annotation.id], [entry.annotation.id]))
      rememberTrigger(next.activeKey, trigger)
      requestFocus(next.activeKey)
      return
    }
    pendingTrigger.current = trigger
    select(entry.annotation, entry.contentUrl)
  }, [selectedAnnotation, select])

  // A group opens as one card. What is selected stays selected if it is a member - the card then
  // shows its row expanded - otherwise nothing is.
  const onOpenGroup = useCallback((members: AlignedEntry[], trigger: HTMLElement) => {
    const ids = members.map((m) => m.annotation.id)
    const selectedId = selectedAnnotation?.annotation?.id
    const keepSelection = !!selectedId && ids.includes(selectedId)
    const next = setWorkbench(wb.openCard(workbenchRef.current, ids, keepSelection ? [selectedId] : []))
    rememberTrigger(next.activeKey, trigger)
    requestFocus(next.activeKey)
    if (!keepSelection) setSelectedAnnotation(null)
  }, [selectedAnnotation])

  if (!layout) return null

  return <>
    <div data-aligned-list className="relative" style={{ height: layout.innerHeight }} inert={workbenchOpen || undefined}>
      {layout.slots.map((slot) => <AlignedSlotView key={slot.id} slot={slot} column={column} onSelect={onSelect} onOpenGroup={onOpenGroup} />)}
    </div>
    {overlayHost && createPortal(<Workbench
      state={workbench}
      annotationsById={annotationsById}
      context={rowContext}
      actions={workbenchActions}
      focusRequest={focusRequest}
    />, overlayHost)}
  </>
}

export default AlignAnnotationsList
