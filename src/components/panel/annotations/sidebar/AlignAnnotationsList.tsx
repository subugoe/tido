import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useAnnotations, getVisibleContentUrls } from '@/contexts/AnnotationsContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getFilteredAnnotations, getSource } from '@/utils/annotations.ts'
import { getAnnotationTargets, getAnnotationType } from '@/utils/annotation-data.ts'
import { AlignedEntry, AlignedSlot, layoutAligned, measureAligned } from '@/utils/aligned-layout.ts'
import { isProgrammaticScroll, markProgrammaticScroll } from '@/utils/dom.ts'
import { SYNC_SCROLL_THRESHOLD_TOP } from '@/utils/scroller.ts'
import AlignedSlotView, { AlignedColumnInfo } from '@/components/panel/annotations/sidebar/aligned/AlignedSlotView.tsx'

interface Layout {
  slots: AlignedSlot[]
  innerHeight: number
  // identifies the layout, so a measurement that changes nothing does not render again
  key: string
}

function getLayoutKey(slots: AlignedSlot[], innerHeight: number) {
  return innerHeight + ';' + slots.map((s) => s.y + ':' + s.members.map((m) => m.contentUrl + '|' + m.annotation.id).join(',')).join(';')
}

function findEntry(slots: AlignedSlot[], annotationId: string): AlignedEntry | undefined {
  for (const slot of slots) {
    const entry = slot.members.find((m) => m.annotation.id === annotationId)
    if (entry) return entry
  }
}

// The aligned annotations column: one entry per annotation at the height of its target, in the
// coordinates of the target's own text. The layout is only recomputed when the layout of a text or
// the sidebar changes - not on scrolling and not on a selection. The sidebar follows the leading
// text (see Scroller).
const AlignAnnotationsList: FC = () => {
  const { panelId, panelState, annotations, matchedAnnotationsMaps, selectedAnnotation, setSelectedAnnotation, getScroller } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { setAlignmentLoading } = useAnnotations()
  const [layout, setLayout] = useState<Layout | null>(null)
  const frame = useRef(0)

  const panelViews = panelState?.panelViews
  const contents = panelState?.item?.contents
  const tooltipTypes = annotationsConfig?.tooltipTypes

  // The visible texts in panel order with the annotations shown for each of them.
  const textAnnotations = useMemo(() => getVisibleContentUrls(panelViews, contents).map((contentUrl) => {
    const map = matchedAnnotationsMaps[contentUrl]
    const annotations = map
      ? getFilteredAnnotations(map).filter((a) => !(tooltipTypes ?? []).includes(getAnnotationType(a)))
      : []
    return { contentUrl, annotations }
  }), [panelViews, contents, matchedAnnotationsMaps, tooltipTypes])

  // The sub-annotations of an annotation are the ones targeting its body - counted the way the
  // annotation card lists them, without cross references and tooltip types.
  const crossRefType = annotationsConfig?.crossRefContentType
  const column = useMemo<AlignedColumnInfo>(() => {
    const subAnnotationCounts = new Map<string, number>()
    ;(annotations ?? []).forEach((annotation) => {
      const type = getAnnotationType(annotation)
      if (type === 'CrossRef' || type === crossRefType || (tooltipTypes ?? []).includes(type)) return
      const target = getAnnotationTargets(annotation)[0]
      const parentId = target ? getSource(target).id : null
      if (parentId) subAnnotationCounts.set(parentId, (subAnnotationCounts.get(parentId) ?? 0) + 1)
    })
    return { subAnnotationCounts, showOrigin: textAnnotations.length > 1 }
  }, [annotations, crossRefType, tooltipTypes, textAnnotations.length])

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
    const entry = findEntry(layout.slots, annotation.id)
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

  const onSelect = useCallback((entry: AlignedEntry) => {
    if (selectedAnnotation?.annotation?.id === entry.annotation.id) {
      setSelectedAnnotation(null)
      return
    }
    getScroller().setOriginSelection('annotation')
    setSelectedAnnotation({ annotation: entry.annotation, origin: 'annotation', contentUrl: entry.contentUrl })
  }, [selectedAnnotation])

  if (!layout) return null

  return <div data-aligned-list className="relative" style={{ height: layout.innerHeight }}>
    {layout.slots.map((slot) => <AlignedSlotView key={slot.id} slot={slot} column={column} onSelect={onSelect} />)}
  </div>
}

export default AlignAnnotationsList
