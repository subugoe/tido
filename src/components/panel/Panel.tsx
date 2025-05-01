import React, { FC, useEffect, useRef, useState } from 'react'

import PanelBody from '@/components/panel/PanelBody.tsx'
import PanelHeader from '@/components/panel/PanelHeader.tsx'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'
import { GripVertical } from 'lucide-react'

const DEFAULT_PANEL_WIDTH = 600
const MIN_PANEL_WIDTH = 400

const Panel: FC = React.memo(() => {
  const { panelId } = usePanel()
  const scrollPanelIds = useScrollStore(state => state.panelIds)
  const [isScrollPanel, setIsScrollPanel] = useState(false)

  useEffect(() => {
    setIsScrollPanel(panelId ? scrollPanelIds.includes(panelId) : false)
  }, [scrollPanelIds, panelId])

  const cardRef = useRef(null)
  const [width, setWidth] = useState(DEFAULT_PANEL_WIDTH)
  const [resizing, setResizing] = useState(false)
  const [isHoveringEdge, setIsHoveringEdge] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      if (resizing) {
        const rect = (cardRef.current as HTMLElement).getBoundingClientRect()
        const newWidth = e.clientX - rect.left
        setWidth(Math.max(MIN_PANEL_WIDTH, newWidth))
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

  return (
    <div
      ref={cardRef}
      style={{
        width,
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
        `panel t-relative t-flex t-flex-shrink-0 t-flex-col t-border-solid t-border-2 t-rounded-lg
        ${isScrollPanel ? 't-border-amber-300 t-ring-4 t-ring-amber-50' : 't-border-slate-200'}
      `}
      data-cy="panel"
    >
      {isScrollPanel && <ScrollPanelMenu className="t-absolute t-top-0 t-left-1/2 -t-translate-x-1/2" />}
      <PanelHeader />
      <PanelBody />
      <div
        className="t-z-10 t-absolute t-flex t-h-6 t-w-3 t-items-center t-justify-center t-rounded-sm t-border t-border-gray-200 t-bg-gray-200 dark:t-border-gray-800
        dark:t-bg-gray-800 -t-translate-y-1/2 t-top-1/2 -t-right-2"
      >
        <GripVertical className="t-h-4 t-w-2.5 t-text-gray-600" />
      </div>
    </div>
  )
})

export default Panel
