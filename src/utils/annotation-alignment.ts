import { getSource } from '@/utils/annotations.ts'
import { alignContainer, scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { getScroller } from '@/utils/scroller.ts'

// How a text container is moved by delta pixels. The default scrolls it directly. The target the
// scroll is for travels with it, so a scroll that goes through the scroller can carry the synoptic
// connection of that target along (Scroller.propagateToSyncedTargets).
type ScrollText = (contentUrl: string, delta: number, targetEl: HTMLElement) => void

function getAnnotationEl(panelEl: HTMLElement, annotation: Annotation): HTMLElement | null {
  return panelEl?.querySelector(`[data-annotation="${annotation.id}"]`) as HTMLElement
}

// The scroll container of the text view showing this content url in this panel - the element the
// scroller tags when that text view registers. Null when no view of the panel shows it.
function getTextEl(panelId: string, contentUrl: string): HTMLElement | null {
  return getScroller().getText(panelId, contentUrl)
}

function getSidebarEl(panelEl: HTMLElement): HTMLElement | null {
  return panelEl?.querySelector('[data-sidebar-scroll-container]') as HTMLElement
}

// Scrolls a container to its current position plus delta, clamped to its scroll range. Returns the
// position it ends up at, which is the current one when there was nothing left to scroll.
function scrollBy(container: HTMLElement, delta: number): number {
  return alignContainer(container, container.scrollTop + delta, 'smooth')
}

// The card in the sidebar and the target in whichever text view holds it. Null when either is
// missing - the view showing that content type may not be open, or the card may be filtered out.
function getAlignmentPair(panelId: string, panelEl: HTMLElement, annotation: Annotation) {
  const target = annotation.target[0]
  const targetSourceUrl = getSource(target).id
  const textScrollContainer = getTextEl(panelId, targetSourceUrl)
  if (!textScrollContainer) return null

  const targetEl = textScrollContainer.querySelector((target.selector as CssSelector).value) as HTMLElement
  const annotationEl = getAnnotationEl(panelEl, annotation)
  if (!targetEl || !annotationEl) return null

  return { targetEl, annotationEl, targetSourceUrl }
}

// Scrolls the text so the target ends up at the same height as its card in the sidebar.
function alignTextToAnnotation(panelId: string, panelEl: HTMLElement, annotation: Annotation, scrollText?: ScrollText) {
  const pair = getAlignmentPair(panelId, panelEl, annotation)
  if (!pair) return

  const delta = pair.targetEl.getBoundingClientRect().top - pair.annotationEl.getBoundingClientRect().top
  const scroll = scrollText ?? ((contentUrl: string, by: number) => scrollBy(getTextEl(panelId, contentUrl), by))
  scroll(pair.targetSourceUrl, delta, pair.targetEl)
}


function alignSidebarToAnnotation(panelId: string, panelEl: HTMLElement, annotation: Annotation) {
  const sidebar = getSidebarEl(panelEl)
  const pair = getAlignmentPair(panelId, panelEl, annotation)
  if (!sidebar || !pair) return

  const delta = pair.annotationEl.getBoundingClientRect().top - pair.targetEl.getBoundingClientRect().top
  scrollBy(sidebar, delta)
}

// An external selection - one made through the config, a bookmarked state or a cross reference.
// We add scrollText as param so that AlignAnnotationsList and AnnotationsList can make use of this function
// Brings the card into the sidebar viewport, then lines the text up with it. In aligned mode only
// call this once the sidebar is scrollable - the cards are absolutely positioned there, so before
// their top values are committed the sidebar has no scroll range and the card would be clamped to 0.
function handleExternalSelection(panelId: string, panelEl: HTMLElement, annotation: Annotation, signal: AbortSignal, scrollText?: ScrollText) {
  const sidebar = getSidebarEl(panelEl)
  const annotationEl = getAnnotationEl(panelEl, annotation)
  if (!sidebar || !annotationEl) return

  // Returns the scrollTop the sidebar settles at. Getting the current one back means the card was
  // already in view and no scroll was started, so there is no scrollend to wait for and the card
  // is already standing still.
  const settledScrollTop = scrollIntoViewIfNeeded(annotationEl, sidebar)
  // we align text once the sidebar scroll to the selectedAnnotation has finished
  if (settledScrollTop === sidebar.scrollTop) alignTextToAnnotation(panelId, panelEl, annotation, scrollText)
  else sidebar.addEventListener('scrollend', () => alignTextToAnnotation(panelId, panelEl, annotation, scrollText), { once: true, signal })
}

export type { ScrollText }

export {
  getAnnotationEl,
  getTextEl,
  getSidebarEl,
  getAlignmentPair,
  alignTextToAnnotation,
  alignSidebarToAnnotation,
  handleExternalSelection
}
