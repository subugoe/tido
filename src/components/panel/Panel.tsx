import React, { FC, useEffect, useRef, useState } from 'react'

import PanelBody from '@/components/panel/PanelBody.tsx'
import PanelHeader from '@/components/panel/PanelHeader.tsx'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'
import { GripVertical } from 'lucide-react'
import SelectViewPopover from '@/components/panel/SelectViewPopover.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

const DEFAULT_PANEL_WIDTH = 600
const MIN_PANEL_WIDTH = 400

const Panel: FC = React.memo(() => {
  const { panelId } = usePanel()
  const enabledSelectViewPopover = useUIStore(state => state.enabledSelectViewPopover)
  const showSelectViewState = useUIStore(state => state.showSelectViewPopover)
  const showSelectViewPopover = panelId === usePanelStore().getLastPanelId()
    && enabledSelectViewPopover && showSelectViewState

  const scrollPanelIds = useScrollStore(state => state.panelIds)
  const [isScrollPanel, setIsScrollPanel] = useState(false)
  const [flexValues, setFlexValues] = useState({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%'
  })

  const cardRef = useRef(null)
  const [resizing, setResizing] = useState(false)
  const [isHoveringEdge, setIsHoveringEdge] = useState(false)

  useEffect(() => {
    // On mount, we need to decide how set the width. If there is space inside the wrapper,
    // we can keep default flex settings, as they make the panel grow and use the remaining space.
    // If there is not enough space, we omit all the growing capability and set a default width

    const wrapper = document.getElementById('panels-wrapper')
    if (!wrapper) return

    const wrapperWidth = wrapper.getBoundingClientRect().width
    const otherPanelEls = ([...wrapper.querySelectorAll('.panel')] as HTMLElement[])
      .filter(el => el.id !== '' && el.id !== panelId)

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
      setFlexValues({
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: `${DEFAULT_PANEL_WIDTH}px`
      })
    }
  }, [])

  useEffect(() => {
    setIsScrollPanel(scrollPanelIds.includes(panelId))
  }, [scrollPanelIds, panelId])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      if (resizing) {
        const rect = (cardRef.current as HTMLElement).getBoundingClientRect()
        const newWidth = e.clientX - rect.left
        setFlexValues({
          flexShrink: 0,
          flexGrow: 0,
          flexBasis: `${Math.max(MIN_PANEL_WIDTH, newWidth)}px`
        })
        return
      }

      // Hover detection logic (within 8px of right edge)
      const rect = (cardRef.current as HTMLElement).getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      setIsHoveringEdge(offsetX > rect.width - 8 && offsetX <= rect.width)
    }

    const handleMouseUp = () => setResizing(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing])

  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 100) // slight delay ensures transition applies
    return () => clearTimeout(timer)
  }, [showSelectViewPopover])


  return (
    <div
      id={panelId}
      ref={cardRef}
      style={{
        flexGrow: flexValues.flexGrow,
        flexShrink: flexValues.flexShrink,
        flexBasis: flexValues.flexBasis,
        userSelect: resizing ? 'none' : 'auto',
        cursor: isHoveringEdge ? 'ew-resize' : 'default',
      }}
      onMouseDown={(e) => {
        if (!cardRef.current) return
        const rect = (cardRef.current as HTMLElement).getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        if (offsetX > rect.width - 8) {
          setResizing(true)
        }
      }}
      className={
        `panel relative bg-background text-foreground flex flex-col border-2 rounded-lg
        ${isScrollPanel ? 'border-amber-300 ring-4 ring-amber-50' : 'border-border'}
      `}
      data-cy="panel"
    >
      <div
        className={`
      absolute w-full h-full inset-0 bg-black/40 transition-opacity duration-500 z-10 backdrop-blur-xs
      ${showSelectViewPopover ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}
      />
      {isScrollPanel && <ScrollPanelMenu className="absolute top-0 left-1/2 -translate-x-1/2" />}
      <PanelHeader />
      <PanelBody />
      {showSelectViewPopover ?
        <SelectViewPopover animate={animate}  /> : null}
      <div
        className="z-10 absolute flex h-6 w-3 items-center justify-center rounded-sm border border-border bg-muted
         -translate-y-1/2 top-1/2 -right-2"
      >
        <GripVertical className="h-4 w-2.5 text-muted-foreground" />
      </div>
    </div>
  )
})

export default Panel
