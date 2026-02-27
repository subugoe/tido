import {
  SIDEBAR_DEFAULT_WIDTH,
  MIN_PANEL_WIDTH,
  PANEL_GAP
} from '@/utils/panel.ts'


class PanelResizer {
  wrapper: HTMLElement
  panelEl: HTMLElement
  panelId: string
  resizeHandle: HTMLElement
  sidebarWidth: number = SIDEBAR_DEFAULT_WIDTH

  eventListeners: Array<{ name: string; listener: EventListener }> = []
  isResizing = false
  annotationsOpen = false
  lastWidth: number | null = null

  constructor(panelEl: HTMLElement) {
    this.init(panelEl)
  }

  init(panelEl: HTMLElement) {
    this.wrapper = document.getElementById('panels-wrapper')
    this.panelEl = panelEl
    this.panelId = this.panelEl.id
    this.resizeHandle = this.panelEl.querySelector('[data-resize-handle]')

    this.panelEl.style.minWidth = `${MIN_PANEL_WIDTH}px`

    this.resize()
    this.dragToResize()
  }

  resize() {
    const width = this.calculateWidth(this.wrapper)
    this.lastWidth = width
    this.panelEl.style.width = `${width}px`
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
    const handleMouseMove = (e: MouseEvent) => {
      if (this.isResizing) {
        const rect = this.panelEl.getBoundingClientRect()
        const newWidth = e.clientX - rect.left

        if (newWidth < MIN_PANEL_WIDTH + (this.annotationsOpen ? this.sidebarWidth : 0)) return

        this.lastWidth = newWidth
        this.panelEl.style.width = `${newWidth}px`
        return
      }

      // Hover detection logic (within 8px of right edge)
      const rect = this.panelEl.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      this.setIsHoveringEdge(offsetX > rect.width - 8 && offsetX <= rect.width)
    }

    const handleMouseUp = () => this.setIsResizing(false)

    const handleMouseDown = (e: MouseEvent) => {
      const rect = this.panelEl.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      if (offsetX > rect.width - 8) {
        this.setIsResizing(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    this.resizeHandle.addEventListener('mousedown', handleMouseDown)

    this.eventListeners.push(...[
      { name: 'mousemove', listener: handleMouseMove },
      { name: 'mouseup', listener: handleMouseUp },
      { name: 'mousedown', listener: handleMouseDown }
    ])
  }

  onResize(callback: (width: number) => void) {
    callback(this.lastWidth)
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

  setAnnotationsOpen(value: boolean) {
    this.annotationsOpen = value
    if (value) {
      this.lastWidth = this.lastWidth + this.sidebarWidth
      this.panelEl.style.width = `${this.lastWidth}px`
    } else {
      this.lastWidth = this.lastWidth - this.sidebarWidth
      this.panelEl.style.width = `${this.lastWidth}px`
      this.sidebarWidth = SIDEBAR_DEFAULT_WIDTH
    }
  }

  setSidebarWidth(value: number) {
    this.sidebarWidth = value
  }

  clean() {
    this.eventListeners.forEach(({ name, listener }) => {
      window.removeEventListener(name, listener)
    })
  }
}

export {
  PanelResizer
}
