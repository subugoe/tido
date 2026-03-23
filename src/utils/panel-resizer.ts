import {
  SIDEBAR_DEFAULT_WIDTH,
  MIN_PANEL_WIDTH,
  PANEL_GAP,
  PANEL_BORDER_WIDTH
} from '@/utils/panel.ts'

class PanelResizer {
  wrapper: HTMLElement
  panelEl: HTMLElement
  mainContentEl: HTMLElement
  sidebarEl: HTMLElement | null = null

  panelId: string
  resizeHandle: HTMLElement
  sidebarWidth: number = SIDEBAR_DEFAULT_WIDTH

  panelEventListeners: { el: HTMLElement | Window; name: string; listener: EventListener }[] = []
  sidebarEventListeners: { el: HTMLElement | Window; name: string; listener: EventListener }[] = []

  isResizing = false
  isSidebarResizing = false
  annotationsOpen = false
  lastWidth: number | null = null

  private isDragToResizeInitialized = false
  private isSidebarResizeInitialized = false

  constructor(panelEl: HTMLElement) {
    this.init(panelEl)
  }

  init(panelEl: HTMLElement) {
    this.wrapper = document.getElementById('panels-wrapper')
    this.panelEl = panelEl
    this.mainContentEl = panelEl.querySelector('.main-content')
    this.sidebarEl = panelEl.querySelector('.sidebar')
    this.panelId = this.panelEl.id
    this.resizeHandle = this.panelEl.querySelector('[data-panel-resize-handle]')

    this.panelEl.style.minWidth = `${MIN_PANEL_WIDTH}px`

    this.resize()
    this.dragToResize()
  }

  // ─── Panel edge resize ───────────────────────────────────────────────────────

  resize() {
    const width = this.calculateWidth(this.wrapper)
    this.onResizePanel(width)
  }

  onResizePanel(newWidth: number) {
    this.lastWidth = newWidth
    this.panelEl.style.width = `${newWidth}px`

    if (this.annotationsOpen) {
      const mainWidth = newWidth - this.sidebarWidth
      this.mainContentEl.style.width = `${mainWidth - PANEL_BORDER_WIDTH * 2}px`
      this.sidebarEl.style.left = `${mainWidth - PANEL_BORDER_WIDTH * 2}px`
      this.sidebarEl.style.width = `${this.sidebarWidth}px`
    } else {
      this.mainContentEl.style.width = `${newWidth - PANEL_BORDER_WIDTH * 2}px`
      this.sidebarEl.style.left = `${newWidth - PANEL_BORDER_WIDTH * 2}px`
      this.sidebarEl.style.width = '0px'
    }
  }

  calculateWidth(wrapper: HTMLElement): number {
    const wrapperStyle = window.getComputedStyle(wrapper)
    const totalWidth = parseFloat(wrapperStyle.width)
    const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0
    const paddingRight = parseFloat(wrapperStyle.paddingRight) || 0
    const wrapperWidth = totalWidth - paddingLeft - paddingRight

    const panels = ([...wrapper.querySelectorAll('.panel')] as HTMLElement[])
    const placeholderWidth = (wrapper.querySelector('[data-panel-placeholder]') as HTMLElement)?.offsetWidth ?? 0
    const amountGaps = placeholderWidth > 0 ? panels.length : panels.length - 1
    const baseWidth = (wrapperWidth - placeholderWidth - this.sidebarWidth - (PANEL_GAP * amountGaps)) / panels.length
    return Math.max(baseWidth, MIN_PANEL_WIDTH)
  }

  dragToResize() {
    if (this.isDragToResizeInitialized) return
    this.isDragToResizeInitialized = true

    const handleMouseMove = (e: MouseEvent) => {
      if (this.isResizing) {
        const rect = this.panelEl.getBoundingClientRect()
        const newWidth = e.clientX - rect.left

        if (newWidth < MIN_PANEL_WIDTH + (this.annotationsOpen ? this.sidebarWidth : 0)) return

        this.onResizePanel(newWidth)
        return
      }

      const rect = this.panelEl.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const isNearEdge = offsetX > rect.width - 12 && offsetX <= rect.width

      this.setIsHoveringEdge(isNearEdge)
    }

    const handleMouseUp = () => this.setIsResizing(false)

    const handleMouseDown = (e: MouseEvent) => {
      const rect = this.panelEl.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      if (offsetX > rect.width - 12) {
        this.setIsResizing(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    this.panelEl.addEventListener('mousedown', handleMouseDown)

    this.panelEventListeners.push(
      { el: window, name: 'mousemove', listener: handleMouseMove },
      { el: window, name: 'mouseup', listener: handleMouseUp },
      { el: this.panelEl, name: 'mousedown', listener: handleMouseDown }
    )
  }

  setIsHoveringEdge(value: boolean) {
    this.panelEl.style.cursor = value ? 'ew-resize' : 'default'
  }

  setIsResizing(value: boolean) {
    this.isResizing = value
    this.panelEl.style.userSelect = value ? 'none' : 'auto'

    if (value) {
      this.panelEl.classList.add('transition-none')
      this.panelEl.classList.remove('transition-[width]')
    } else {
      this.panelEl.classList.add('transition-[width]')
      this.panelEl.classList.remove('transition-none')
    }
  }

  // ─── Sidebar split resize ────────────────────────────────────────────────────

  private initSidebarResize() {
    if (!this.sidebarEl) return
    if (this.isSidebarResizeInitialized) return
    this.isSidebarResizeInitialized = true

    const handleMouseDown = (e: MouseEvent) => {
      if (!this.sidebarEl) return

      const sidebarRect = this.sidebarEl.getBoundingClientRect()
      const offsetX = e.clientX - sidebarRect.left

      if (offsetX > 12) return

      e.preventDefault()
      e.stopPropagation()
      this.isSidebarResizing = true
      this.panelEl.style.userSelect = 'none'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!this.sidebarEl) return

      const sidebarRect = this.sidebarEl.getBoundingClientRect()
      const offsetX = e.clientX - sidebarRect.left
      const isNearEdge = offsetX <= 12

      if (!this.isSidebarResizing) {
        this.sidebarEl.style.cursor = isNearEdge ? 'ew-resize' : 'default'
        return
      }

      const panelRect = this.panelEl.getBoundingClientRect()
      const newMainWidth = e.clientX - panelRect.left
      const newSidebarWidth = panelRect.width - newMainWidth

      if (newMainWidth < MIN_PANEL_WIDTH || newSidebarWidth < SIDEBAR_DEFAULT_WIDTH) return

      this.mainContentEl.style.width = `${newMainWidth - PANEL_BORDER_WIDTH * 2}px`
      this.sidebarEl.style.left = `${newMainWidth - PANEL_BORDER_WIDTH * 2}px`
      this.sidebarEl.style.width = `${newSidebarWidth}px`
      this.sidebarWidth = newSidebarWidth
    }

    const handleMouseUp = () => {
      if (!this.isSidebarResizing) return
      this.isSidebarResizing = false
      this.panelEl.style.userSelect = 'auto'
    }

    this.sidebarEl.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    this.sidebarEventListeners.push(
      { el: this.sidebarEl, name: 'mousedown', listener: handleMouseDown },
      { el: window, name: 'mousemove', listener: handleMouseMove },
      { el: window, name: 'mouseup', listener: handleMouseUp }
    )
  }

  private teardownSidebarResize() {
    this.sidebarEventListeners.forEach(({ el, name, listener }) => {
      el.removeEventListener(name, listener)
    })
    this.sidebarEventListeners = []
    this.isSidebarResizeInitialized = false

    if (this.sidebarEl) {
      this.sidebarEl.style.cursor = ''
    }
  }

  // ─── Annotations open/close ──────────────────────────────────────────────────

  setAnnotationsOpen(isOpen: boolean) {
    if (isOpen === this.annotationsOpen) return
    this.annotationsOpen = isOpen

    if (isOpen) {
      const newWidth = this.lastWidth + this.sidebarWidth
      this.onResizePanel(newWidth)
      this.initSidebarResize()
    } else {
      // Reset sidebarWidth before onResizePanel so the subtraction uses the right value
      this.sidebarWidth = SIDEBAR_DEFAULT_WIDTH

      // Clear any manual drag overrides so onResizePanel takes full control
      this.mainContentEl.style.width = ''
      this.sidebarEl.style.left = ''
      this.sidebarEl.style.width = ''

      const newWidth = this.lastWidth - this.sidebarWidth
      this.onResizePanel(newWidth)
      this.teardownSidebarResize()
    }
  }

  setSidebarWidth(value: number) {
    this.sidebarWidth = value
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────────

  clean() {
    [...this.panelEventListeners, ...this.sidebarEventListeners].forEach(({ el, name, listener }) => {
      el.removeEventListener(name, listener)
    })
    this.panelEventListeners = []
    this.sidebarEventListeners = []
    this.isDragToResizeInitialized = false
    this.isSidebarResizeInitialized = false
  }
}

export { PanelResizer }
