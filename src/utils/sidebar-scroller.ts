class SidebarScroller {
  private sidebar: HTMLElement | null = null
  private text: HTMLElement | null = null
  private isSyncing = false
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
    this.syncScroll(this.sidebar, this.text)
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
