import { getSource } from '@/utils/annotations.ts'

const SYNC_SCROLL_THRESHOLD_TOP = 0.35
const SYNC_SCROLL_THRESHOLD_BOTTOM = 0.45

class Scroller {
  private sidebar: HTMLElement | null = null
  private texts: {[contentUrl: string]: HTMLElement} = {}
  private isSyncing = false
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

  setText(url: string, element: HTMLElement) {
    this.texts[url] = element
    element.setAttribute('data-content-url', url)
  }

  setMatchedMap(map: {[contentUrl: string]: MatchedAnnotationsMap}) {
    this.matchedMap = map
  }

  setSyncMaps(map: {[contentUrl: string]: SyncMap}) {
    this.syncMaps = map
  }

  syncScroll(source: HTMLElement, target: HTMLElement) {
    if (!source || !target) return
    this.isSyncing = true
    target.scrollTop = source.scrollTop
    requestAnimationFrame(() => (this.isSyncing = false))
  }

  scrollOtherTexts(contentUrl: string) {
    const text = this.texts[contentUrl]
    const textRect = text.getBoundingClientRect()
    const scrollTop = text.scrollTop
    const refTop = scrollTop + text.clientHeight * SYNC_SCROLL_THRESHOLD_TOP
    const refBottom = scrollTop + text.clientHeight * SYNC_SCROLL_THRESHOLD_BOTTOM

    const annotationIds = Object.keys(this.syncMaps[contentUrl])
    let focusedTarget: HTMLElement | undefined
    let focusedAnnotationId: string | undefined

    for (const id of annotationIds) {
      const targets = this.syncMaps[contentUrl][id]

      focusedTarget = targets.find(target => {
        const targetRect = target.getBoundingClientRect()
        const targetTop = targetRect.top - textRect.top + scrollTop
        const targetBottom = targetRect.bottom - textRect.top + scrollTop
        return targetTop < refBottom && targetBottom > refTop
      }) as HTMLElement

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

      if (!otherTargets) break

      const otherText = this.texts[otherUrl]
      const otherTextRect = otherText.getBoundingClientRect()
      const targetRect = otherTargets[0].getBoundingClientRect()

      const targetTop = targetRect.top - otherTextRect.top + otherText.scrollTop
      const targetOffset = otherText.clientHeight * 0.35
      otherText.scrollTop = targetTop - targetOffset
    }

    setTimeout(() => this.isSyncing = false, 20)
  }

  handleSidebarScroll() {
    if (this.isSyncing || !this.sidebar) return
    const refY = this.sidebar.scrollTop + this.sidebar.clientHeight * SYNC_SCROLL_THRESHOLD_TOP

    const mapEntries = Object
      .values(this.matchedMap)
      .flatMap(map => Object.values(map))
      .filter(item => item.filtered)

    const entry = mapEntries.find(entry => {
      const card = this.sidebar.querySelector(`[data-annotation="${entry.annotation.id}"]`) as HTMLElement
      const top = parseInt(card.style.top)
      const bottom = top + card.offsetHeight
      return refY >= top && refY < bottom
    })

    if (!entry || entry.annotation.id === this.focusedAnnotationId) return

    this.focusedAnnotationId = entry.annotation.id
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
    this.syncScroll(this.texts[contentUrl], this.sidebar)
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
}

export {
  Scroller
}
