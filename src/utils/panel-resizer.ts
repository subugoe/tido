import {
  MIN_PANEL_WIDTH,
  DEFAULT_PANEL_WIDTH,
  PANEL_BORDER_WIDTH,
  PANEL_GAP
} from '@/utils/constants'
import { PanelConfig } from '@/types'

// ─── Initial widths ──────────────────────────────────────────────────────────
// The panels that exist at the start share the room the panels wrapper leaves for them instead of
// each opening at DEFAULT_PANEL_WIDTH, so the first layout uses all the room available. They split
// it equally. The annotations are a pane inside the panel, so opening them does not widen the panel
// and no room has to be kept for them. The "open new panel" placeholder is not subtracted - it simply
// keeps the width it needs, so it stays visible as long as the panels do not fill the whole row.
// When the room left is too small for a minimum width, the panels fall back to MIN_PANEL_WIDTH.
// A panel with showViewportWidth takes the full width of the wrapper on its own. The other panels
// share the room as if it were not there.
function getInitialPanelWidths(wrapper: HTMLElement, configs: PanelConfig[]): number[] {
  if (configs.length === 0) return []

  const wrapperStyle = window.getComputedStyle(wrapper)
  const contentWidth = wrapper.clientWidth
    - (parseFloat(wrapperStyle.paddingLeft) || 0)
    - (parseFloat(wrapperStyle.paddingRight) || 0)

  const sharingCount = configs.filter(config => !config.showViewportWidth).length

  // One gap between each pair of panels, plus one before the visible placeholder.
  const hasPlaceholder = wrapper.querySelector('[data-panel-placeholder]') !== null
  const gutters = PANEL_GAP * (sharingCount - 1 + (hasPlaceholder ? 1 : 0))

  const contentPerPanel = (contentWidth - gutters) / sharingCount

  return configs.map((config) => Math.max(MIN_PANEL_WIDTH, config.showViewportWidth ? contentWidth : contentPerPanel))
}

class PanelResizer {
  wrapper: HTMLElement
  panelEl: HTMLElement
  mainContentEl: HTMLElement

  panelId: string
  resizeHandle: HTMLElement

  panelEventListeners: { el: HTMLElement | Window; name: string; listener: EventListener }[] = []

  isResizing = false
  lastWidth: number | null = null

  private isDragToResizeInitialized = false

  constructor(panelEl: HTMLElement, initialWidth?: number | string) {
    this.init(panelEl, initialWidth)
  }

  init(panelEl: HTMLElement, initialWidth?: number | string) {
    this.wrapper = document.getElementById('panels-wrapper')
    this.panelEl = panelEl
    this.mainContentEl = panelEl.querySelector('.main-content')
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

  // New panels always open at DEFAULT_PANEL_WIDTH.
  getInitialWidth(): number {
    return DEFAULT_PANEL_WIDTH
  }

  onResizePanel(newWidth: number) {
    const clamped = Math.max(MIN_PANEL_WIDTH, newWidth)
    this.lastWidth = clamped
    this.applyWidths(clamped)
  }

  // These inline widths are the windowed layout. In fullscreen they are overridden by the
  // :fullscreen rules in style.css rather than recalculated here.
  private applyWidths(totalWidth: number) {
    this.panelEl.style.width = `${totalWidth}px`
    this.mainContentEl.style.width = `${totalWidth - PANEL_BORDER_WIDTH * 2}px`
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

        if (newWidth < MIN_PANEL_WIDTH) return

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

  // ─── Cleanup ─────────────────────────────────────────────────────────────────

  clean() {
    this.panelEventListeners.forEach(({ el, name, listener }) => {
      el.removeEventListener(name, listener)
    })
    this.panelEventListeners = []
    this.isDragToResizeInitialized = false
  }
}

export { PanelResizer, getInitialPanelWidths }
