import React, { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

import PanelBody from '@/components/panel/PanelBody.tsx'
import PanelHeader from '@/components/panel/PanelHeader.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'
import { GripVertical } from 'lucide-react'
import SelectTextView from '@/components/panel/select-view/SelectTextView.tsx'


const Panel: FC = React.memo(() => {
  const { panelId, panelState, resizer, initResizer, bodyMounted } = usePanel()
  const newestPanelId = useUIStore(state => state.newestPanelId)
  const showSelectViewState = useUIStore(state => state.showSelectTextView)
  const showSelectTextView = panelId === newestPanelId && showSelectViewState

  const scrollPanelIds = useScrollStore(state => state.panelIds)
  const [isScrollPanel, setIsScrollPanel] = useState(false)

  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current || !bodyMounted) return
    console.log('panel')

    initResizer(cardRef.current)
    return () => {
      if (resizer) resizer.clean()
    }
  }, [cardRef.current, bodyMounted])

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
        `panel relative bg-background text-foreground flex border-2 rounded-lg overflow-hidden
        ${isScrollPanel ? 'border-amber-300 ring-4 ring-amber-50' : 'border-border'}
      `}
      data-cy="panel"
    >
      <div className={`main-content flex flex-col ${!panelState.annotationsOpen ? 'grow-war-1' : ''}`}>
        <div
          className={`
            absolute w-full h-full inset-0 bg-white/40 transition-opacity duration-500 z-10 backdrop-blur-xs
            ${showSelectTextView ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        />
        {isScrollPanel && <ScrollPanelMenu className="absolute top-0 left-1/2 -translate-x-1/2" />}
        <PanelHeader />
        <PanelBody />
        {showSelectTextView && cardRef.current && <SelectTextView parentEl={cardRef.current}  /> }
        <div
          className="z-10 absolute flex h-6 w-3 items-center justify-center rounded-sm border border-border bg-muted
         -translate-y-1/2 top-1/2 -right-2"
        >
          <GripVertical className="h-4 w-2.5 text-muted-foreground" />
        </div>
      </div>
      {/*{ <div className={`flex flex-col border-l ${panelState.annotationsOpen ? 'border-border shrink-0 grow-1' : 'border-transparent shrink-1 grow-0'} overflow-hidden relative`}>*/}
      {/*  { renderSidebarContent && <div className="absolute w-[400px] h-full">*/}
      {/*    <Annotations />*/}
      {/*  </div> }*/}
      {/*</div> }*/}
    </div>
  )
})

export default Panel
