import React, { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

import PanelHeader from '@/components/panel/PanelHeader.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'
import { GripVertical } from 'lucide-react'
import SelectPanelModeDialog from '@/components/panel/select-panel-mode/SelectPanelModeDialog.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import Swapper from '@/components/panel/Swapper.tsx'
import AnnotationsBody from '@/components/panel/annotations/AnnotationsBody.tsx'
import AnnotationHints from '@/components/panel/annotations/AnnotationHints.tsx'

const Panel: FC = React.memo(() => {
  const { panelId, panelState, initResizer, resizer } = usePanel()
  const newestPanelId = useUIStore(state => state.newestPanelId)
  const showSelectModeState = useUIStore(state => state.showSelectPanelMode)
  const showSelectPanelMode = panelId === newestPanelId && showSelectModeState

  const scrollPanelIds = useScrollStore(state => state.panelIds)
  const [isScrollPanel, setIsScrollPanel] = useState(false)

  const ref = useRef(null)

  const [showSidebarContent, setShowSidebarContent] = useState(false)
  const [showSidebarBorders, setShowSidebarBorders] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showSwapper, setShowSwapper] = useState(false)

  useEffect(() => {
    if (resizer) resizer.handleTextUpdate()
    if (panelState.mode === 'swap') {
      setShowImage(false)
      setShowText(true)
      setShowSwapper(true)
    } else if (panelState.mode === 'split') {
      setShowImage(true)
      setShowText(true)
      setShowSwapper(false)
    } else if (panelState.mode === 'text') {
      setShowImage(false)
      setShowText(true)
      setShowSwapper(false)
    } else if (panelState.mode === 'image') {
      setShowImage(true)
      setShowText(false)
      setShowSwapper(false)
    }
  }, [panelState.mode])

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
    if (!ref.current) return
    initResizer(ref.current)
    return () => {
      if (resizer) resizer.clean()
    }
  }, [])

  useEffect(() => {
    setIsScrollPanel(scrollPanelIds.includes(panelId))
  }, [scrollPanelIds, panelId])

  useEffect(() => {
    const scrollPosX = ref.current.offsetLeft - ref.current.offsetWidth / 2
    document.getElementById('panels-wrapper').scrollTo({ left: scrollPosX, behavior: 'smooth' })
  }, [showSelectPanelMode])

  return (
    <div
      id={panelId}
      ref={ref}
      className={`panel bg-background text-foreground grow-0 shrink-0 transition-[width] relative`}
      data-cy="panel"
    >
      <div className={`h-full flex flex-col relative border-2 rounded-lg overflow-hidden ${isScrollPanel ? 'border-amber-300 ring-4 ring-amber-50' : 'border-border'}`}>
        <div
          className={`
          absolute w-full h-full inset-0 bg-white/40 transition-opacity duration-500 z-10 backdrop-blur-xs
          ${showSelectPanelMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}
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

        <div className="relative flex h-full overflow-hidden border-t border-border">
          <div data-image-container
            className={`grow-0 shrink-0 ${showImage ? 'block' : 'hidden'} border-r border-border`}>
            {showImage && <ImageView />}
          </div>
          <div data-scroll-container className={`h-full w-full bg-accent overflow-x-hidden overflow-y-auto relative`}>
            <div data-text-container className={`bg-background p-2 min-h-full relative`}>
              {showText && <TextView />}
              {showSwapper && <Swapper />}
            </div>
            <div data-sidebar-container
              className={`absolute top-0 h-full w-[400px] pl-2 border-l ${showSidebarBorders ? 'border-border' : 'border-transparent'}`}>
              {showSidebarContent && <AnnotationsBody />}
            </div>
          </div>
          <AnnotationHints />
        </div>
        {showSelectPanelMode && ref.current && <SelectPanelModeDialog parentEl={ref.current} />}
      </div>
      <div data-resize-handle className="z-10 absolute flex h-6 w-3 items-center justify-center rounded-sm border border-border bg-muted -translate-y-1/2 top-1/2 -right-[6px]">
        <GripVertical className="h-4 w-2.5 text-muted-foreground" />
      </div>
    </div>
  )
})

export default Panel
