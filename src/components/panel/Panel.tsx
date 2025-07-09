import React, { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

import PanelBody from '@/components/panel/PanelBody.tsx'
import PanelHeader from '@/components/panel/PanelHeader.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'
import { GripVertical } from 'lucide-react'
import SelectTextView from '@/components/panel/select-view/SelectTextView.tsx'
import AnnotationsBody from '@/components/panel/annotations/AnnotationsBody.tsx'


const Panel: FC = React.memo(() => {
  const { panelId, panelState, resizer, initResizer } = usePanel()
  const newestPanelId = useUIStore(state => state.newestPanelId)
  const showSelectViewState = useUIStore(state => state.showSelectTextView)
  const showSelectTextView = panelId === newestPanelId && showSelectViewState

  const scrollPanelIds = useScrollStore(state => state.panelIds)
  const [isScrollPanel, setIsScrollPanel] = useState(false)
  const [showSidebarContent, setShowSidebarContent] = useState(false)
  const [showSidebarBorders, setShowSidebarBorders] = useState(false)


  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    initResizer(cardRef.current)
    return () => {
      if (resizer) resizer.clean()
    }
  }, [])

  useEffect(() => {
    if (!resizer) return
    resizer.setAnnotationsOpen(panelState.annotationsOpen)
    if (panelState.annotationsOpen) {
      setShowSidebarBorders(true)
      const timeout = setTimeout(() => {
        setShowSidebarContent(true)
      }, 200)
      return () => clearTimeout(timeout)
    } else {
      setShowSidebarContent(false)
      setShowSidebarBorders(false)
    }
  }, [panelState.annotationsOpen])

  useEffect(() => {
    setIsScrollPanel(scrollPanelIds.includes(panelId))
  }, [scrollPanelIds, panelId])

  useEffect(() => {
    const scrollPosX = cardRef.current.offsetLeft - cardRef.current.offsetWidth / 2
    document.getElementById('panels-wrapper').scrollTo({ left: scrollPosX, behavior: 'smooth' })
  }, [showSelectTextView])

  return (
    <div
      id={panelId}
      ref={cardRef}
      className={
        `panel relative bg-background text-foreground flex flex-col border-2 rounded-lg overflow-hidden transition-[flex-basis]
        ${isScrollPanel ? 'border-amber-300 ring-4 ring-amber-50' : 'border-border'}
      `}
      data-cy="panel"
    >
      <div
        className={`
          absolute w-full h-full inset-0 bg-white/40 transition-opacity duration-500 z-10 backdrop-blur-xs
          ${showSelectTextView ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />
      {isScrollPanel && <ScrollPanelMenu className="absolute top-0 left-1/2 -translate-x-1/2" />}

      <div className="relative">
        <div data-panel-header className={`px-3 pt-3 pb-5`}>
          <PanelHeader />
        </div>
        <div data-header-sidebar className={`absolute top-0 h-full w-[400px] pl-2 border-l ${showSidebarBorders ? 'border-border' : 'border-transparent'}`}>
        </div>
      </div>
      <div data-scroll-container className={`h-full w-full bg-accent border-t border-border overflow-x-hidden overflow-y-auto relative`}>
        <div data-text-container className={`bg-background p-2 min-h-full`}>
          <PanelBody />
        </div>
        <div data-sidebar-container className={`absolute top-0 h-full w-[400px] pl-2 border-l ${showSidebarBorders ? 'border-border' : 'border-transparent'}`}>
          { showSidebarContent && <AnnotationsBody /> }
        </div>
      </div>

      {showSelectTextView && cardRef.current && <SelectTextView parentEl={cardRef.current}  /> }
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
