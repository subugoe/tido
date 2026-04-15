class SidebarScroller {
  private sidebar: HTMLElement | null = null
  private text: HTMLElement | null = null
  private isSyncing = false
  private focusedAnnotationId: string | null = null
  private matchedMap: {[contentUrl: string]: MatchedAnnotationsMap} = {}
  private handleSidebarScrollBound: EventListener
  private handleTextScrollBound: EventListener

  constructor() {
    this.handleSidebarScrollBound = this.handleSidebarScroll.bind(this)
    this.handleTextScrollBound = this.handleTextScroll.bind(this)
  }

  setSidebar(element: HTMLElement) {
    this.sidebar = element
  }

  setText(element: HTMLElement) {
    this.text = element
  }

  setMatchedMap(map: {[contentUrl: string]: MatchedAnnotationsMap}) {
    this.matchedMap = map
  }

  getSidebar() {
    return this.sidebar
  }

  getText() {
    return this.text
  }

  syncScroll(source: HTMLElement, target: HTMLElement) {
    if (this.isSyncing) return
    this.isSyncing = true
    target.scrollTop = source.scrollTop
    requestAnimationFrame(() => (this.isSyncing = false))
  }

  handleSidebarScroll() {
    if (this.isSyncing) return
    const refY = this.sidebar.scrollTop + this.sidebar.clientHeight * 0.35

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
      const textRect = this.text.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()
      const targetTop = targetRect.top - textRect.top + this.text.scrollTop
      const targetOffset = this.text.clientHeight * 0.35
      this.text.scrollTop = targetTop - targetOffset
    }
    setTimeout(() => this.isSyncing = false, 20)
  }

  handleTextScroll() {
    this.syncScroll(this.text, this.sidebar)
  }

  start() {
    this.sidebar?.addEventListener('scroll', this.handleSidebarScrollBound)
    this.text?.addEventListener('scroll', this.handleTextScrollBound)
  }

  stop() {
    this.sidebar?.removeEventListener('scroll', this.handleSidebarScrollBound)
    this.text?.removeEventListener('scroll', this.handleTextScrollBound)
  }
}

export {
  SidebarScroller
}
