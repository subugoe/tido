import { ANNOTATION_PANEL_WIDTH, DEFAULT_PANEL_WIDTH, MIN_PANEL_WIDTH } from '@/utils/panel.ts'


class PanelResizer {
  panelEl: HTMLElement
  panelId: string
  textContainerEl: HTMLElement
  scrollContainerEl: HTMLElement
  headerEl: HTMLElement
  sidebarEl: HTMLElement
  headerSidebarEl: HTMLElement
  eventListeners = []
  isResizing = false
  annotationsOpen = false
  userWidth = null

  constructor(panelEl: HTMLElement) {
    this.init(panelEl)
  }

  init(panelEl: HTMLElement) {
    this.panelEl = panelEl
    this.panelId = this.panelEl.id
    this.scrollContainerEl = this.panelEl.querySelector('[data-scroll-container]')
    this.textContainerEl = this.panelEl.querySelector('[data-text-container]')
    this.headerEl = this.panelEl.querySelector('[data-panel-header]')
    this.sidebarEl = this.panelEl.querySelector('[data-sidebar-container]')
    this.headerSidebarEl = this.panelEl.querySelector('[data-header-sidebar]')

    // On mount, we need to decide how set the width. If there is space inside the wrapper,
    // we can keep default flex settings, as they make the panel grow and use the remaining space.
    // If there is not enough space, we omit all the growing capability and set a default width

    this.panelEl.style.minWidth = `${MIN_PANEL_WIDTH}px`

    const wrapper = document.getElementById('panels-wrapper')
    if (!wrapper) return

    const wrapperWidth = wrapper.getBoundingClientRect().width
    const otherPanelEls = ([...wrapper.querySelectorAll('.panel')] as HTMLElement[])
      .filter(el => el.id !== '' && el.id !== this.panelId)

    // Return an array of widths. If a panel is in "grow" mode, it has no flexBasis pixel value.
    // In that case, we set that value to min width as basis for total width calculation.
    // The reason is that those panels can also shrink.
    const otherPanelWidths = otherPanelEls.map(el => {
      return (el.style.flexBasis.includes('px')) ? parseInt(el.style.flexBasis.replace('px', '')) : MIN_PANEL_WIDTH
    })

    const otherPanelsTotalWidth = otherPanelWidths.reduce((a, b) => a + b, 0)

    // We are adding here an additional DEFAULT_PANEL_WIDTH for the ghost panel that is the last child in the wrapper.
    const isFitting = (wrapperWidth - (otherPanelsTotalWidth + DEFAULT_PANEL_WIDTH)) >= 0

    if (!isFitting) {
      this.setFlexValues({
        flexGrow: '0',
        flexShrink: '0',
        flexBasis: `${DEFAULT_PANEL_WIDTH}px`
      })
    } else {
      this.setFlexValues({})
    }

    this.setMainContentWidth('100%')

    this.dragToResize()
  }

  handleTextUpdate() {
    const width = this.annotationsOpen ? Math.max(this.panelEl.offsetWidth - ANNOTATION_PANEL_WIDTH, MIN_PANEL_WIDTH) : '100%'
    this.setMainContentWidth(width)
  }

  setFlexValues({
    flexGrow = '1',
    flexShrink = '1',
    flexBasis = '0px'
  }) {
    this.panelEl.style.flexGrow = flexGrow.toString()
    this.panelEl.style.flexShrink = flexShrink.toString()
    this.panelEl.style.flexBasis = flexBasis
  }

  setMainContentWidth(width: string | number) {
    this.textContainerEl.style.width = width === '100%' ? width : `${width}px`
    this.headerEl.style.width = width === '100%' ? width : `${width}px`
    this.sidebarEl.style.left = width === '100%' ? this.panelEl.offsetWidth + 'px' : `${width}px`
    this.headerSidebarEl.style.left = width === '100%' ? this.panelEl.offsetWidth + 'px' : `${width}px`
  }

  dragToResize() {
    const handleMouseMove = (e: MouseEvent) => {
      if (this.isResizing) {
        const rect = this.panelEl.getBoundingClientRect()
        const newWidth = e.clientX - rect.left
        this.userWidth = newWidth
        this.setFlexValues({
          flexShrink: '0',
          flexGrow: '0',
          flexBasis: `${Math.max(MIN_PANEL_WIDTH, newWidth)}px`
        })
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
    window.addEventListener('mousedown', handleMouseDown)

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
      this.panelEl.classList.remove('transition-[flex-basis]')
    } else {
      this.panelEl.classList.add('transition-[flex-basis]')
      this.panelEl.classList.remove('transition-none')
    }
  }

  setAnnotationsOpen(value: boolean) {
    this.annotationsOpen = value
    if (value) {
      this.setFlexValues({
        flexGrow: this.panelEl.style.flexGrow,
        flexShrink: '0',
        flexBasis: `${this.panelEl.offsetWidth + ANNOTATION_PANEL_WIDTH}px`
      })

      this.setMainContentWidth(this.panelEl.offsetWidth - 4)

      const sidebar = this.panelEl.querySelector('[data-sidebar-container]')
      const scrollBarWidth = this.scrollContainerEl.offsetWidth - this.scrollContainerEl.clientWidth

      sidebar.style.right = `-${scrollBarWidth}px`
      sidebar.style.paddingRight = `${scrollBarWidth}px`
    } else {
      this.setFlexValues({
        flexGrow: this.panelEl.style.flexGrow,
        flexShrink: '0',
        flexBasis: this.userWidth !== null ? `${this.userWidth}px` : `0px`
      })
    }
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
