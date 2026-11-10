import {
  SIDEBAR_DEFAULT_WIDTH,
  MIN_PANEL_WIDTH,
  DEFAULT_PANEL_WIDTH,
  PANEL_BORDER_WIDTH,
  PANEL_GAP
} from '@/utils/constants'
import { PanelConfig } from '@/types'

// ─── Initial widths ──────────────────────────────────────────────────────────
// The panels that exist at the start share the room the panels wrapper leaves for them instead of
// each opening at DEFAULT_PANEL_WIDTH, so the first layout uses all the room available. They split
// it equally. Room is kept for a sidebar, because a sidebar takes additional width out of the
// panel when it is opened. The "open new panel" placeholder is not subtracted - it simply keeps
// the width it needs, so it stays visible as long as the panels do not fill the whole row.
// When the room left is too small for a minimum width, the panels fall back to MIN_PANEL_WIDTH.
// A panel with showViewportWidth takes the full width of the wrapper on its own, without room for a
// sidebar - when a sidebar is opened in it, its main content shrinks so the panel still fits into the
// viewport (see PanelResizer.setShowSidebar). The other panels share the room as if it were not there.
function getInitialPanelWidths(wrapper: HTMLElement, configs: PanelConfig[]): number[] {
  if (configs.length === 0) return []

  const contentWidth = getWrapperContentWidth(wrapper)

  const sharingCount = configs.filter(config => !config.showViewportWidth).length

  // One gap between each pair of panels, plus one before the visible placeholder.
  const hasPlaceholder = wrapper.querySelector('[data-panel-placeholder]') !== null
  const gutters = PANEL_GAP * (sharingCount - 1 + (hasPlaceholder ? 1 : 0))

  // Keep room for a sidebar: when it is opened, it is added to the width of its panel.
  const sidebarRoom = SIDEBAR_DEFAULT_WIDTH

  const contentPerPanel = (contentWidth - gutters - sidebarRoom) / sharingCount

  return configs.map((config) => Math.max(MIN_PANEL_WIDTH, config.showViewportWidth ? contentWidth : contentPerPanel))
}

// The width the panels wrapper leaves for its panels: the viewport the panels are laid out in.
function getWrapperContentWidth(wrapper: HTMLElement): number {
  const wrapperStyle = window.getComputedStyle(wrapper)
  return wrapper.clientWidth
    - (parseFloat(wrapperStyle.paddingLeft) || 0)
    - (parseFloat(wrapperStyle.paddingRight) || 0)
}

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
  showSidebar = false
  lastWidth: number | null = null
  // The panel width right before the sidebar was opened. Closing the sidebar restores it, so the main
  // content gets back exactly the width it had, even if it was shrunk to fit the sidebar into the
  // viewport. Dropped when the user resizes the panel edge while the sidebar is open.
  private widthBeforeSidebar: number | null = null
  private scrollIntoViewTimeout: ReturnType<typeof setTimeout> | null = null

  private isDragToResizeInitialized = false
  private isSidebarResizeInitialized = false

  constructor(panelEl: HTMLElement, initialWidth?: number | string) {
    this.init(panelEl, initialWidth)
  }

  init(panelEl: HTMLElement, initialWidth?: number | string) {
    this.wrapper = document.getElementById('panels-wrapper')
    this.panelEl = panelEl
    this.mainContentEl = panelEl.querySelector('.main-content')
    this.sidebarEl = panelEl.querySelector('[data-sidebar-container]')
    this.panelId = this.panelEl.id
    this.resizeHandle = this.panelEl.querySelector('[data-panel-resize-handle]')

    this.panelEl.style.minWidth = `${MIN_PANEL_WIDTH}px`

    const currentWidth = parseFloat(this.panelEl.style.width)
    const datasetInitialWidth = this.panelEl.dataset.initialWidth
    const candidate = initialWidth !== undefined && initialWidth !== '' ? initialWidth : datasetInitialWidth

    if (Number.isFinite(currentWidth) && currentWidth > 0) {
      if (datasetInitialWidth !== undefined) {
        delete this.panelEl.dataset.initialWidth
      }
      // Keep the panel's own existing width (e.g. it was resized before, or is a duplicate)
      this.onResizePanel(Math.max(MIN_PANEL_WIDTH, currentWidth))
    } else if (candidate !== undefined && candidate !== '') {
      const parsed = typeof candidate === 'number' ? candidate : parseFloat(candidate)
      if (datasetInitialWidth !== undefined) {
        delete this.panelEl.dataset.initialWidth
      }
      if (Number.isFinite(parsed) && parsed > 0) {
        this.onResizePanel(parsed)
      } else {
        this.onResizePanel(this.getInitialWidth())
      }
    } else {
      this.onResizePanel(this.getInitialWidth())
    }

    this.dragToResize()
  }

  // ─── Panel edge resize ───────────────────────────────────────────────────────

  // New panels always open at DEFAULT_PANEL_WIDTH. If the sidebar is already open,
  // that sidebar width is added on top of the initial width.
  getInitialWidth(): number {
    return DEFAULT_PANEL_WIDTH + (this.showSidebar ? this.sidebarWidth : 0)
  }

  onResizePanel(newWidth: number) {
    const clamped = Math.max(MIN_PANEL_WIDTH + (this.showSidebar ? this.sidebarWidth : 0), newWidth)
    this.lastWidth = clamped
    this.applyWidths(clamped)
  }

  // These inline widths are the windowed layout. In fullscreen they are overridden by the
  // :fullscreen rules in style.css rather than recalculated here - see publishSidebarWidth.
  private applyWidths(totalWidth: number) {
    this.publishSidebarWidth()
    this.panelEl.style.width = `${totalWidth}px`

    if (this.showSidebar) {
      const mainWidth = totalWidth - this.sidebarWidth
      this.mainContentEl.style.width = `${mainWidth - PANEL_BORDER_WIDTH * 2}px`
      if (this.sidebarEl) {
        this.sidebarEl.style.left = `${mainWidth - PANEL_BORDER_WIDTH * 2}px`
        this.sidebarEl.style.width = `${this.sidebarWidth}px`
      }
    } else {
      this.mainContentEl.style.width = `${totalWidth - PANEL_BORDER_WIDTH * 2}px`
      if (this.sidebarEl) {
        // when Panel is in error state -> PanelError is shown, Sidebar view is not mounted -> we need this check
        this.sidebarEl.style.left = `${totalWidth - PANEL_BORDER_WIDTH * 2}px`
        this.sidebarEl.style.width = '0px'
      }
    }
  }

  // ─── Fullscreen ──────────────────────────────────────────────────────────────

  // The fullscreen layout is pure CSS so that it applies in the same style recalculation that makes
  // the panel fullscreen. The split point is the one value CSS cannot know by itself (the sidebar
  // is user-resizable), so it is published as a custom property for the :fullscreen rules to read.
  private publishSidebarWidth() {
    this.panelEl.style.setProperty(
      '--panel-sidebar-width',
      `${this.showSidebar ? this.sidebarWidth : 0}px`
    )
  }

  dragToResize() {
    if (this.isDragToResizeInitialized) return
    this.isDragToResizeInitialized = true

    const handleMouseMove = (e: MouseEvent) => {
      // In fullscreen the panel edge is the screen edge and widths are CSS-driven; a drag here would
      // only corrupt lastWidth, i.e. the width the panel returns to on exit.
      if (document.fullscreenElement) return

      if (this.isResizing) {
        const rect = this.panelEl.getBoundingClientRect()
        const newWidth = e.clientX - rect.left

        if (newWidth < MIN_PANEL_WIDTH + (this.showSidebar ? this.sidebarWidth : 0)) return

        this.widthBeforeSidebar = null
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
      if (document.fullscreenElement) return

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
      this.publishSidebarWidth()
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

  // ─── Sidebar show/hide ──────────────────────────────────────────────────

  setShowSidebar(isOpen: boolean) {
    if (isOpen === this.showSidebar) return
    this.showSidebar = isOpen

    if (isOpen) {
      this.widthBeforeSidebar = this.lastWidth
      this.onResizePanel(this.getWidthWithSidebar())
      this.initSidebarResize()
      this.scrollIntoView()
    } else {
      // Without a remembered width (the panel edge was dragged while the sidebar was open), the main
      // content keeps its current width. Computed before resetting sidebarWidth, which may have been
      // changed by dragging the split.
      const newWidth = this.widthBeforeSidebar ?? this.lastWidth - this.sidebarWidth
      this.widthBeforeSidebar = null
      this.sidebarWidth = SIDEBAR_DEFAULT_WIDTH

      // Clear any manual drag overrides so onResizePanel takes full control
      this.mainContentEl.style.width = ''
      if (this.sidebarEl) {
        this.sidebarEl.style.left = ''
        this.sidebarEl.style.width = ''
      }

      this.onResizePanel(newWidth)
      this.teardownSidebarResize()
    }
  }

  // The sidebar is added to the panel's width, but only as far as the free room in the row of panels
  // allows - the main content is squeezed for the rest, so opening the sidebar does not make the
  // panels wrapper scroll horizontally. The content never gets narrower than MIN_PANEL_WIDTH; when
  // even that does not fit (e.g. many panels), the row overflows and scrollIntoView takes over.
  private getWidthWithSidebar(): number {
    const desired = this.lastWidth + this.sidebarWidth
    if (!this.wrapper) return desired

    const freeRoom = getWrapperContentWidth(this.wrapper) - this.getRowWidth()
    const maxWidth = this.lastWidth + Math.max(0, freeRoom)
    return Math.max(MIN_PANEL_WIDTH + this.sidebarWidth, Math.min(desired, maxWidth))
  }

  // The width all items of the panels wrapper (panels, gaps, placeholder) take up. This panel counts
  // with lastWidth rather than its rendered width, which may still be mid-transition.
  private getRowWidth(): number {
    return Array.from(this.wrapper.children).reduce((sum, child) => {
      const el = child as HTMLElement
      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.position === 'absolute' || style.position === 'fixed') return sum

      const margins = (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0)
      const width = el === this.panelEl ? this.lastWidth : el.getBoundingClientRect().width
      return sum + width + margins
    }, 0)
  }

  // Scroll the panels wrapper so the whole panel - including the newly opened sidebar - is visible.
  // Waits for the width transition, otherwise the wrapper cannot scroll far enough yet.
  private scrollIntoView() {
    if (this.scrollIntoViewTimeout) clearTimeout(this.scrollIntoViewTimeout)

    this.scrollIntoViewTimeout = setTimeout(() => {
      this.scrollIntoViewTimeout = null
      if (!this.wrapper || !this.showSidebar || document.fullscreenElement) return

      const wrapperStyle = window.getComputedStyle(this.wrapper)
      const paddingLeft = parseFloat(wrapperStyle.paddingLeft) || 0
      const paddingRight = parseFloat(wrapperStyle.paddingRight) || 0

      const wrapperRect = this.wrapper.getBoundingClientRect()
      const panelRect = this.panelEl.getBoundingClientRect()
      const scrollLeft = this.wrapper.scrollLeft
      const panelLeft = panelRect.left - wrapperRect.left + scrollLeft
      const panelRight = panelLeft + panelRect.width

      // Bring the right edge into view first; the left edge wins if both cannot be visible.
      let target = scrollLeft
      if (panelRight > scrollLeft + this.wrapper.clientWidth - paddingRight) {
        target = panelRight - this.wrapper.clientWidth + paddingRight
      }
      if (panelLeft < target + paddingLeft) target = panelLeft - paddingLeft
      if (target === scrollLeft) return

      this.wrapper.scrollTo({ left: target, behavior: 'smooth' })
    }, 200)
  }

  setSidebarWidth(value: number) {
    this.sidebarWidth = value
    this.publishSidebarWidth()
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

    if (this.scrollIntoViewTimeout) clearTimeout(this.scrollIntoViewTimeout)
    this.scrollIntoViewTimeout = null
  }
}

export { PanelResizer, getInitialPanelWidths }
