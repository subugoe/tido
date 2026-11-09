import { getSelectorValue, getSource } from '@/utils/annotations.ts'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { getAnnotationTargets } from '@/utils/annotation-data.ts'

// How a text container is moved by delta pixels. The default scrolls it directly.
type ScrollText = (contentUrl: string, delta: number) => void

function getAnnotationEl(panelEl: HTMLElement, annotation: Annotation): HTMLElement | null {
  return panelEl?.querySelector(`[data-annotation="${annotation.id}"]`) as HTMLElement
}

// The scroll container of the text view showing this content url - the element the scroller tags
// when it registers a text view.
function getTextEl(panelEl: HTMLElement, contentUrl: string): HTMLElement | null {
  return panelEl?.querySelector(`[data-content-url="${contentUrl}"]`) as HTMLElement
}

function getSidebarEl(panelEl: HTMLElement): HTMLElement | null {
  return panelEl?.querySelector('[data-sidebar-scroll-container]') as HTMLElement
}

// Scrolls a container to its current position plus delta, clamped to its scroll range. Returns the
// position it ends up at, which is the current one when there was nothing left to scroll.
function scrollBy(container: HTMLElement, delta: number): number {
  const maxScrollTop = container.scrollHeight - container.clientHeight
  const top = Math.max(0, Math.min(container.scrollTop + delta, maxScrollTop))
  if (top === container.scrollTop) return container.scrollTop

  container.scrollTo({ top, behavior: 'smooth' })
  return top
}

interface TargetEl {
  targetEl: HTMLElement
  // the scroll container of the text view the target lies in
  textEl: HTMLElement
  contentUrl: string
}

// Every element the targets of an annotation resolve to in the open text views. Scoped to each text like
// in matchAnnotations, so a target that is not matched there is not aligned either. A target whose text
// view is not open, or whose selector is empty or invalid, resolves to nothing.
function getTargetEls(panelEl: HTMLElement, annotation: Annotation): TargetEl[] {
  return getAnnotationTargets(annotation).flatMap(target => {
    if (!target) return []
    const contentUrl = getSource(target).id
    const textEl = getTextEl(panelEl, contentUrl)
    const selector = getSelectorValue(target)
    if (!textEl || !selector) return []

    try {
      return Array.from(textEl.querySelectorAll<HTMLElement>(`:scope ${selector}`))
        .map(targetEl => ({ targetEl, textEl, contentUrl }))
    } catch {
      return []
    }
  })
}

// The top of a target within its text, the scrolled distance included. Null when the target has no top
// it can be aligned with: it is no longer in the document, or it is not rendered (display: none gives an
// empty rect at 0).
function getTargetTop({ targetEl, textEl }: TargetEl): number | null {
  if (!targetEl.isConnected) return null

  const rect = targetEl.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null

  const top = rect.top - textEl.getBoundingClientRect().top + textEl.scrollTop
  return Number.isFinite(top) ? top : null
}

// The target an annotation is aligned with: the top most of all its targets. A target whose top is not
// valid is skipped, so the annotation is aligned with the next one. Null when no target has a valid top.
function getTopTarget(panelEl: HTMLElement, annotation: Annotation): (TargetEl & { top: number }) | null {
  return getTargetEls(panelEl, annotation).reduce<(TargetEl & { top: number }) | null>((topMost, cur) => {
    const top = getTargetTop(cur)
    if (top === null || (topMost && topMost.top <= top)) return topMost
    return { ...cur, top }
  }, null)
}

// The card in the sidebar and the top most target in whichever text view holds it. Null when either is
// missing - the view showing that content type may not be open, or the card may be filtered out.
function getAlignmentPair(panelEl: HTMLElement, annotation: Annotation) {
  const topTarget = getTopTarget(panelEl, annotation)
  const annotationEl = getAnnotationEl(panelEl, annotation)
  if (!topTarget || !annotationEl) return null

  return { targetEl: topTarget.targetEl, annotationEl, targetSourceUrl: topTarget.contentUrl }
}

// Scrolls the text so the target ends up at the same height as its card in the sidebar.
function alignTextToAnnotation(panelEl: HTMLElement, annotation: Annotation, scrollText?: ScrollText) {
  const pair = getAlignmentPair(panelEl, annotation)
  if (!pair) return

  const delta = pair.targetEl.getBoundingClientRect().top - pair.annotationEl.getBoundingClientRect().top
  const scroll = scrollText ?? ((contentUrl: string, by: number) => scrollBy(getTextEl(panelEl, contentUrl), by))
  scroll(pair.targetSourceUrl, delta)
}


function alignSidebarToAnnotation(panelEl: HTMLElement, annotation: Annotation) {
  const sidebar = getSidebarEl(panelEl)
  const pair = getAlignmentPair(panelEl, annotation)
  if (!sidebar || !pair) return

  const delta = pair.annotationEl.getBoundingClientRect().top - pair.targetEl.getBoundingClientRect().top
  scrollBy(sidebar, delta)
}

// An external selection - one made through the config, a bookmarked state or a cross reference.
// We add scrollText as param so that AlignAnnotationsList and AnnotationsList can make use of this function
// Brings the card into the sidebar viewport, then lines the text up with it. In aligned mode only
// call this once the sidebar is scrollable - the cards are absolutely positioned there, so before
// their top values are committed the sidebar has no scroll range and the card would be clamped to 0.
function handleExternalSelection(panelEl: HTMLElement, annotation: Annotation, signal: AbortSignal, scrollText?: ScrollText) {
  const sidebar = getSidebarEl(panelEl)
  const annotationEl = getAnnotationEl(panelEl, annotation)
  if (!sidebar || !annotationEl) return

  // Returns the scrollTop the sidebar settles at. Getting the current one back means the card was
  // already in view and no scroll was started, so there is no scrollend to wait for and the card
  // is already standing still.
  const settledScrollTop = scrollIntoViewIfNeeded(annotationEl, sidebar)
  // we align text once the sidebar scroll to the selectedAnnotation has finished
  if (settledScrollTop === sidebar.scrollTop) alignTextToAnnotation(panelEl, annotation, scrollText)
  else sidebar.addEventListener('scrollend', () => alignTextToAnnotation(panelEl, annotation, scrollText), { once: true, signal })
}

export type { ScrollText }

export {
  getAnnotationEl,
  getTextEl,
  getSidebarEl,
  getAlignmentPair,
  getTargetEls,
  getTopTarget,
  alignTextToAnnotation,
  alignSidebarToAnnotation,
  handleExternalSelection
}
