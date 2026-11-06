import { isProgrammaticScroll, markProgrammaticScroll } from '@/utils/dom.ts'

export const SYNC_SCROLL_THRESHOLD_TOP = 0.35
const SYNC_SCROLL_THRESHOLD_BOTTOM = 0.45

// How long a scrollTop we set ourselves stays muted: its scroll event fires a frame later and must
// not be taken for the user's scrolling and synced back.
const MUTE_DURATION = 120

// Find the topmost target sitting in the scroll container's "focused" band - the strip of the
// visible area between SYNC_SCROLL_THRESHOLD_TOP and _BOTTOM, extended down to the container bottom
// when scrolled near the end. The band is part of the visible area, so a target overlapping it is on
// screen by definition. Used by the synopsis scroll listener.
export function findFocusedTarget(scrollContainer: HTMLElement, targets: Element[]): HTMLElement | undefined {
  const { top, bottom, height } = scrollContainer.getBoundingClientRect()

  const remainingScrollAmount = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight
  const isNearBottom = remainingScrollAmount <= height * (1 - SYNC_SCROLL_THRESHOLD_BOTTOM)

  const bandTop = top + height * SYNC_SCROLL_THRESHOLD_TOP
  const bandBottom = isNearBottom ? bottom : top + height * SYNC_SCROLL_THRESHOLD_BOTTOM

  let focusedTarget: HTMLElement | undefined
  let smallestTop = Infinity

  targets.forEach((target) => {
    const { top: targetTop, bottom: targetBottom } = target.getBoundingClientRect()
    if (targetTop >= bandBottom || targetBottom <= bandTop) return

    // the one closest to the top of the band, whatever order the targets come in
    if (targetTop < smallestTop) {
      smallestTop = targetTop
      focusedTarget = target as HTMLElement
    }
  })

  return focusedTarget
}

// Couples the aligned annotations sidebar with the texts of the panel. The entries are positioned in
// the coordinates of their texts, so the sidebar shows them right as long as it has the scrollTop of
// the text it is read against: the leading text, the one the user scrolled last. Scrolling the
// sidebar scrolls the leading text along. The texts stay independent of each other - moving them
// together is the synopsis' business, and the scrolls it makes never change the leading text.
class Scroller {
  private sidebar: HTMLElement | null = null
  private texts: {[contentUrl: string]: HTMLElement} = {}
  private syncEnabled = false
  private leadUrl: string | null = null
  private originSelection: 'text' | 'annotation' | 'config' = 'text'
  // while the workbench covers the sidebar it stands still: not scrollable, not following any text
  private frozen = false
  // scrollTops we set ourselves, per element, with the time until which their event is ignored
  private muted = new WeakMap<Element, { top: number, until: number }>()
  private handleSidebarScrollBound: EventListener
  private handleTextScrollBound: EventListener

  constructor() {
    this.handleSidebarScrollBound = this.handleSidebarScroll.bind(this)
    this.handleTextScrollBound = this.handleTextScroll.bind(this)
  }

  setSidebar(element: HTMLElement) {
    if (this.sidebar === element) return
    this.stopSidebar()
    this.sidebar = element
    this.startSidebar()
  }

  getSidebar() {
    return this.sidebar
  }

  setText(url: string, element: HTMLElement) {
    this.texts[url] = element
    element.setAttribute('data-content-url', url)
  }

  getText(contentUrl: string) {
    return this.texts[contentUrl]
  }

  setOriginSelection(value: 'text' | 'annotation' | 'config') {
    this.originSelection = value
  }

  getOriginSelection() {
    return this.originSelection
  }

  // Freezes the sidebar behind the workbench, or lets it follow the leading text again - from the
  // scrollTop that text has reached in the meantime.
  setFrozen(value: boolean) {
    if (this.frozen === value) return
    this.frozen = value
    if (this.sidebar) this.sidebar.style.overflowY = value ? 'hidden' : ''
    if (!value) this.syncSidebarToLead()
  }

  isFrozen() {
    return this.frozen
  }

  getLead() {
    return this.leadUrl
  }

  setLead(contentUrl: string | null) {
    this.leadUrl = contentUrl
  }

  // Sets a scrollTop and mutes the scroll event it causes.
  private setScrollTop(el: HTMLElement, top: number) {
    if (Math.abs(el.scrollTop - top) < 1) return
    this.muted.set(el, { top, until: performance.now() + MUTE_DURATION })
    el.scrollTop = top
  }

  private isMuted(el: HTMLElement) {
    const mute = this.muted.get(el)
    if (!mute) return false
    if (performance.now() > mute.until) {
      this.muted.delete(el)
      return false
    }
    // the browser may clamp the value we set, so a small difference still counts as ours
    return Math.abs(el.scrollTop - mute.top) < 2 || el.scrollTop >= el.scrollHeight - el.clientHeight - 1
  }

  // Gives the sidebar the scrollTop of the leading text. Smoothly when the leading text has just
  // changed, so the entries visibly travel to their targets instead of jumping.
  syncSidebarToLead(behavior: ScrollBehavior = 'instant') {
    const lead = this.leadUrl ? this.texts[this.leadUrl] : null
    if (!this.sidebar || !lead || this.frozen) return

    if (behavior === 'smooth') {
      if (Math.abs(this.sidebar.scrollTop - lead.scrollTop) < 1) return
      markProgrammaticScroll(this.sidebar)
      this.sidebar.scrollTo({ top: lead.scrollTop, behavior: 'smooth' })
      return
    }

    this.setScrollTop(this.sidebar, lead.scrollTop)
  }

  private handleSidebarScroll() {
    const sidebar = this.sidebar
    const lead = this.leadUrl ? this.texts[this.leadUrl] : null
    if (!sidebar || !lead || this.frozen) return
    if (this.isMuted(sidebar) || isProgrammaticScroll(sidebar)) return

    // Not marked as programmatic on purpose: for the synopsis this is the user scrolling the text,
    // so its parallel texts follow as they would on a scroll in the text itself.
    this.setScrollTop(lead, sidebar.scrollTop)
  }

  private handleTextScroll(e: Event) {
    const text = e.currentTarget as HTMLElement
    const contentUrl = text.getAttribute('data-content-url')
    if (!contentUrl || this.isMuted(text)) return

    if (contentUrl !== this.leadUrl) {
      // A scroll we started - the synopsis aligning a parallel text, a selection - does not make a
      // text the leading one. Only the user's own scrolling does.
      if (isProgrammaticScroll(text)) return
      this.leadUrl = contentUrl
    }

    // The leading text is followed whoever scrolled it, so the entries stay at their targets.
    if (this.sidebar && !this.frozen) this.setScrollTop(this.sidebar, text.scrollTop)
  }

  // Sidebar and texts are coupled only while the aligned annotation list is mounted - it positions
  // its entries against their targets. Everywhere else they scroll independently, so the listeners
  // stay off and a text view registering in the meantime does not turn them back on by itself.
  startSync() {
    this.syncEnabled = true
    this.startSidebar()
    Object.keys(this.texts).forEach(contentUrl => this.startText(contentUrl))
  }

  stopSync() {
    this.setFrozen(false)
    this.syncEnabled = false
    this.stopSidebar()
    Object.keys(this.texts).forEach(contentUrl => this.stopText(contentUrl))
  }

  startSidebar() {
    if (!this.syncEnabled) return
    this.sidebar?.addEventListener('scroll', this.handleSidebarScrollBound, { passive: true })
  }

  stopSidebar() {
    this.sidebar?.removeEventListener('scroll', this.handleSidebarScrollBound)
  }

  startText(contentUrl: string) {
    if (!this.syncEnabled) return
    this.texts[contentUrl]?.addEventListener('scroll', this.handleTextScrollBound, { passive: true })
  }

  stopText(contentUrl: string) {
    this.texts[contentUrl]?.removeEventListener('scroll', this.handleTextScrollBound)
  }
}

export {
  Scroller
}
