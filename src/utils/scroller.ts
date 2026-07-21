import { getSource } from '@/utils/annotations.ts'

export const SYNC_SCROLL_THRESHOLD_TOP = 0.35
const SYNC_SCROLL_THRESHOLD_BOTTOM = 0.45

// Find the target currently sitting in the scroll container's "focused" band - the first target
// overlapping the reference window between SYNC_SCROLL_THRESHOLD_TOP and _BOTTOM (extended down to
// the container bottom when scrolled near the end). Shared by scrollOtherTexts and the synopsis
// scroll listener in GenericTextRenderer.
export function findFocusedTarget(scrollContainer: HTMLElement, targets: Element[]): HTMLElement | undefined {
  const containerRect = scrollContainer.getBoundingClientRect()
  const scrollTop = scrollContainer.scrollTop

  const remainingBottomHeight = scrollContainer.clientHeight * (1 - SYNC_SCROLL_THRESHOLD_BOTTOM)
  const remainingScrollAmount = scrollContainer.scrollHeight - scrollTop - scrollContainer.clientHeight
  const isNearBottom = remainingScrollAmount <= remainingBottomHeight
  const refTop = scrollTop + scrollContainer.clientHeight * SYNC_SCROLL_THRESHOLD_TOP
  const refBottom = isNearBottom
    ? scrollTop + scrollContainer.clientHeight
    : scrollTop + scrollContainer.clientHeight * SYNC_SCROLL_THRESHOLD_BOTTOM

  return targets.find((target) => {
    const targetRect = target.getBoundingClientRect()
    const targetTop = targetRect.top - containerRect.top + scrollTop
    const targetBottom = targetRect.bottom - containerRect.top + scrollTop
    return targetTop < refBottom && targetBottom > refTop
  }) as HTMLElement | undefined
}

class Scroller {
  private sidebar: HTMLElement | null = null
  private texts: {[contentUrl: string]: HTMLElement} = {}
  private isSyncing = false
  private originSelection: 'text' | 'annotation' = 'text'
  private focusedAnnotationId: string | null = null
  private matchedMap: {[contentUrl: string]: MatchedAnnotationsMap} = {}
  private syncMaps: {[contentUrl: string]: SyncMap} = {}
  private handleSidebarScrollBound: EventListener
  private handleTextScrollBound: EventListener

  constructor() {
    this.handleSidebarScrollBound = this.handleSidebarScroll.bind(this)
    this.handleTextScrollBound = this.handleTextScroll.bind(this)
  }

  setSidebar(element: HTMLElement) {
    this.sidebar = element
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

  setMatchedMap(map: {[contentUrl: string]: MatchedAnnotationsMap}) {
    this.matchedMap = map
  }

  setSyncMaps(map: {[contentUrl: string]: SyncMap}) {
    this.syncMaps = map
  }

  setIsSyncing(value: boolean) {
    this.isSyncing = value
  }

  setOriginSelection(value: 'text' | 'annotation') {
    this.originSelection = value
  }

  getOriginSelection() {
    return this.originSelection
  }

  syncScroll(source: HTMLElement, target: HTMLElement) {
    if (!source || !target) return
    this.isSyncing = true
    target.scrollTop = source.scrollTop
    requestAnimationFrame(() => (this.isSyncing = false))
  }

  scrollOtherTexts(contentUrl: string) {
    if (!this.syncMaps[contentUrl] || !this.texts[contentUrl]) return
    const text = this.texts[contentUrl]
    const scrollTop = text.scrollTop

    const remainingBottomHeight = text.clientHeight * (1 - SYNC_SCROLL_THRESHOLD_BOTTOM)
    const remainingScrollAmount = text.scrollHeight - scrollTop - text.clientHeight
    const isNearBottom = remainingScrollAmount <= remainingBottomHeight

    const annotationIds = Object.keys(this.syncMaps[contentUrl])
    let focusedTarget: HTMLElement | undefined
    let focusedAnnotationId: string | undefined

    for (const id of annotationIds) {
      focusedTarget = findFocusedTarget(text, this.syncMaps[contentUrl][id])

      if (focusedTarget) {
        focusedAnnotationId = id
        break
      }
    }

    if (!focusedTarget) return
    this.isSyncing = true

    const otherTexts = Object.keys(this.texts).filter(url => url !== contentUrl)
    for (const otherUrl of otherTexts) {
      const otherMap = this.syncMaps[otherUrl]
      const otherTargets = otherMap[focusedAnnotationId]

      if (!otherTargets || otherTargets.length === 0) break

      const otherText = this.texts[otherUrl]
      const otherTextRect = otherText.getBoundingClientRect()
      const targetRect = otherTargets[0].getBoundingClientRect()

      const targetTop = targetRect.top - otherTextRect.top + otherText.scrollTop
      const targetOffset = otherText.clientHeight * SYNC_SCROLL_THRESHOLD_TOP
      otherText.scrollTop = isNearBottom ? scrollTop : targetTop - targetOffset

    }

    setTimeout(() => this.isSyncing = false, 20)
  }

  syncSidebarToText(targetSource: string | AnnotationTargetSource) {
    const url = typeof targetSource === 'string' ? targetSource : targetSource.id
    this.syncScroll(this.texts[url], this.sidebar)
  }


  handleSidebarScroll() {
    if (this.isSyncing || !this.sidebar) return
    const refY = this.sidebar.scrollTop + this.sidebar.clientHeight * SYNC_SCROLL_THRESHOLD_TOP

    const mapEntries = Object
      .values(this.matchedMap)
      .flatMap(map => Object.values(map))
      .filter(item => item.filtered)
    // TODO: Ther problem here is that tooltip annotations appear also as filtered=true, we need to handle them better

    const bandEntry = mapEntries.find(entry => {
      const card = this.sidebar.querySelector(`[data-annotation="${entry.annotation.id}"]`) as HTMLElement
      if (!card) return false
      const top = parseInt(card.style.top)
      const bottom = top + card.offsetHeight
      return refY >= top && refY < bottom
    })

    if (!bandEntry || bandEntry.annotation.id === this.focusedAnnotationId) return

    this.focusedAnnotationId = bandEntry.annotation.id

    const entry = bandEntry
    if (this.isSyncing) return
    this.isSyncing = true
    const targetElement = entry.target[0]

    if (targetElement) {
      const contentUrl = getSource(entry.annotation.target[0]).id
      const text = this.texts[getSource(entry.annotation.target[0]).id]
      const textRect = text.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()
      const targetTop = targetRect.top - textRect.top + text.scrollTop
      const targetOffset = text.clientHeight * SYNC_SCROLL_THRESHOLD_TOP
      text.scrollTop = targetTop - targetOffset
      this.scrollOtherTexts(contentUrl)
    }
    setTimeout(() => this.isSyncing = false, 20)
  }

  handleTextScroll(e: Event) {
    if (this.isSyncing) return
    const contentUrl = (e.target as HTMLElement).getAttribute('data-content-url')
    this.scrollOtherTexts(contentUrl)
    if (this.originSelection === 'text')  {
      this.syncScroll(this.texts[contentUrl], this.sidebar)
    }
  }

  startSidebar() {
    this.sidebar?.addEventListener('scroll', this.handleSidebarScrollBound)
  }

  stopSidebar() {
    this.sidebar?.removeEventListener('scroll', this.handleSidebarScrollBound)
  }

  startText(contentUrl: string) {
    this.texts[contentUrl].addEventListener('scroll', this.handleTextScrollBound)
  }

  stopText(contentUrl: string) {
    this.texts[contentUrl].removeEventListener('scroll', this.handleTextScrollBound)
  }

  // Scrolls the text by delta. The scroll is deliberate, so handleTextScroll must not treat it as a
  // user scroll and sync on top of it - isSyncing keeps the listener out until the scroll has come
  // to a stop.
  scrollText(contentUrl: string, delta: number) {
    const text = this.texts[contentUrl]
    if (!text) return

    // Landing on the scrollTop we are already at - because delta is zero or the container is at the
    // end of its range - scrolls nothing and so never reaches scrollend, which means the guard has
    // to be lifted right here instead.
    const maxScrollTop = text.scrollHeight - text.clientHeight
    const top = Math.max(0, Math.min(text.scrollTop + delta, maxScrollTop))
    if (top === text.scrollTop) {
      this.isSyncing = false
      return
    }

    text.addEventListener('scrollend', () => (this.isSyncing = false), { once: true })
    text.scrollTo({ top, behavior: 'smooth' })
  }
}

export {
  Scroller
}
