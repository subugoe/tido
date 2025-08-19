import {
  ANNOTATION_PANEL_WIDTH,
  MIN_PANEL_WIDTH,
  PANEL_BORDER_WIDTH,
  PANEL_GAP
} from '@/utils/panel.ts'
import { PanelMode } from '@/types'


class PanelResizer {
  wrapper: HTMLElement
  panelEl: HTMLElement
  panelId: string
  panelMode: PanelMode
  textContainerEl: HTMLElement
  textScrollbarProxy: HTMLElement
  scrollContainerEl: HTMLElement
  imageContainerEl: HTMLElement
  headerEl: HTMLElement
  sidebarEl: HTMLElement
  headerSidebarEl: HTMLElement
  resizeHandle: HTMLElement
  textOptions: HTMLElement

  eventListeners = []
  isResizing = false
  annotationsOpen = false
  lastWidth = null
  widthByMode = {
    'swap': (width) => width,
    'text': (width) => width,
    'image': (width) => width,
    'split': (width) => width / 2,
  }

  constructor(panelEl: HTMLElement, panelMode: PanelMode) {
    this.init(panelEl, panelMode)
  }

  init(panelEl: HTMLElement, panelMode: PanelMode) {
    this.wrapper = document.getElementById('panels-wrapper')
    this.panelEl = panelEl
    this.panelId = this.panelEl.id
    this.scrollContainerEl = this.panelEl.querySelector('[data-scroll-container]')
    this.textContainerEl = this.panelEl.querySelector('[data-text-container]')
    this.textScrollbarProxy = this.panelEl.querySelector('[data-scrollbar-proxy]')
    this.imageContainerEl = this.panelEl.querySelector('[data-image-container]')
    this.headerEl = this.panelEl.querySelector('[data-panel-header]')
    this.sidebarEl = this.panelEl.querySelector('[data-sidebar-container]')
    this.headerSidebarEl = this.panelEl.querySelector('[data-header-sidebar]')
    this.resizeHandle = this.panelEl.querySelector('[data-resize-handle]')
    this.textOptions = this.panelEl.querySelector('[data-text-options]')

    this.panelMode = panelMode

    this.panelEl.style.minWidth = `${MIN_PANEL_WIDTH}px`

    const proxy = this.textScrollbarProxy
    const child = this.textContainerEl

    proxy.addEventListener('scroll', () => {
      child.scrollLeft = proxy.scrollLeft
    })

    // If you need two-way sync (e.g. user drags content):
    child.addEventListener('scroll', () => {
      proxy.scrollLeft = child.scrollLeft
    })

    this.resize()
    this.dragToResize()
  }

  handleTextUpdate() {
    const width = (this.annotationsOpen ? Math.max(this.panelEl.offsetWidth - ANNOTATION_PANEL_WIDTH, MIN_PANEL_WIDTH) : this.panelEl.offsetWidth) - PANEL_BORDER_WIDTH * 2
    this.setMainContentWidth(width)
  }

  setMainContentWidth(width: number) {
    this.textContainerEl.style.width = `${this.widthByMode[this.panelMode](width)}px`
    this.textScrollbarProxy.querySelector('div').style.width = `${this.widthByMode[this.panelMode](width)}px`
    this.imageContainerEl.style.width = `${this.widthByMode[this.panelMode](width)}px`
    this.headerEl.style.width = `${width}px`
    this.sidebarEl.style.left = `${this.widthByMode[this.panelMode](width)}px`
    this.headerSidebarEl.style.left = `${width}px`
    this.textOptions.style.width = `${this.widthByMode[this.panelMode](width)}px`
    this.textOptions.style.left = `${this.panelMode === 'split' ? width / 2 : 0}px`
  }

  resize() {
    const wrapperStyle = window.getComputedStyle(this.wrapper)
    const totalWidth = parseFloat(wrapperStyle.width)
    const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0
    const paddingRight = parseFloat(wrapperStyle.paddingRight) || 0
    const wrapperWidth = totalWidth - paddingLeft - paddingRight

    const panels = ([...this.wrapper.querySelectorAll('.panel')] as HTMLElement[])
    const placeholderWidth = (this.wrapper.querySelector('[data-panel-placeholder]') as HTMLElement)?.offsetWidth ?? 0

    const baseWidth = (wrapperWidth - placeholderWidth - (PANEL_GAP * panels.length)) / panels.length
    const finalWidth = Math.max(baseWidth, MIN_PANEL_WIDTH)
    this.lastWidth = finalWidth

    this.panelEl.style.width = `${finalWidth}px`
    this.setMainContentWidth(finalWidth - PANEL_BORDER_WIDTH * 2)
  }

  dragToResize() {
    const handleMouseMove = (e: MouseEvent) => {
      if (this.isResizing) {
        const rect = this.panelEl.getBoundingClientRect()
        const newWidth = e.clientX - rect.left

        if (newWidth < MIN_PANEL_WIDTH + (this.annotationsOpen ? ANNOTATION_PANEL_WIDTH : 0)) return

        this.lastWidth = newWidth
        this.panelEl.style.width = `${newWidth}px`
        this.setMainContentWidth(this.panelEl.offsetWidth - 4 - (this.annotationsOpen ? ANNOTATION_PANEL_WIDTH : 0))
        return
      }

      // Hover detection logic (within 8px of right edge)
      const rect = this.panelEl.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      this.setIsHoveringEdge(offsetX > rect.width - 8 && offsetX <= rect.width)
    }

    const handleMouseUp = () => this.setIsResizing(false)

    const handleMouseDown = (e) => {
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
      this.lastWidth = this.lastWidth + ANNOTATION_PANEL_WIDTH
      this.panelEl.style.width = `${this.lastWidth}px`
      this.textOptions.style.right = `${ANNOTATION_PANEL_WIDTH}px`

      const sidebar = this.panelEl.querySelector('[data-sidebar-container]') as HTMLElement
      const scrollBarWidth = this.scrollContainerEl.offsetWidth - this.scrollContainerEl.clientWidth

      sidebar.style.right = `-${scrollBarWidth}px`
      sidebar.style.paddingRight = `${scrollBarWidth}px`
    } else {
      this.lastWidth = this.lastWidth - ANNOTATION_PANEL_WIDTH
      this.panelEl.style.width = `${this.lastWidth}px`
    }
  }

  setPanelMode(mode: PanelMode) {
    this.panelMode = mode
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
