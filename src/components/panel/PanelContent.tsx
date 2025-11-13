import React, { FC, useEffect, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import PanelHeader from '@/components/panel/PanelHeader.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'
import { TextProvider } from '@/contexts/TextContext.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import 'allotment/dist/style.css'
import { Allotment } from 'allotment'
import SidebarView from '@/components/panel/views/SidebarView.tsx'
import SwapView from '@/components/panel/views/SwapView.tsx'
import PanelError from '@/components/panel/PanelError.tsx'
import { DEFAULT_PANEL_WIDTH, SIDEBAR_DEFAULT_WIDTH } from '@/utils/panel.ts'

const PanelContent: FC = React.memo(() => {
  const { panelState, resizer, error } = usePanel()
  const [showSidebar, setShowSidebar] = useState(false)
  const [contentPanes, setContentPanes] = useState([])
  const [sizes, setSizes] = useState({
    main: 0,
    sidebar: 0
  })
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    if (panelState.mode === 'swap') {
      setContentPanes([<SwapView />])
    } else if (panelState.mode === 'split') {
      setContentPanes([<ImageView />, <TextView />])
    } else if (panelState.mode === 'text') {
      setContentPanes([<TextView />])
    } else if (panelState.mode === 'image') {
      setContentPanes([<ImageView />])
    }
  }, [panelState.mode])

  useEffect(() => {
    if (!resizer) return
    setIsOpening(true)
    resizer.setAnnotationsOpen(panelState.annotationsOpen)
    const isOpeningTimeout = setTimeout(() => setIsOpening(false), 500)

    let sidebarContentTimeout = null

    if (panelState.annotationsOpen) {
      // Set flag that displays sidebar pane after the panel shell transition has finished
      sidebarContentTimeout = setTimeout(() => {
        setShowSidebar(true)
      }, 200)
    } else {
      setShowSidebar(false)
    }

    return () => {
      clearTimeout(isOpeningTimeout)
      if (sidebarContentTimeout) clearTimeout(sidebarContentTimeout)
    }
  }, [panelState.annotationsOpen])

  const handleChange = (newSizes) => {
    setSizes({
      main: newSizes[0],
      sidebar: newSizes[1] ?? 0
    })

    if (newSizes[1]) resizer.setSidebarWidth(newSizes[1])
  }

  if (error) return <PanelError error={error} resetErrorBoundary={() => {}} />
  return (
    <div
      className={`h-full flex flex-col relative overflow-hidden`} style={{
        '--sash-hover-size': '2px',
        '--focus-border': 'rgb(var(--tido-color-primary))'
      } as React.CSSProperties}>
      <div
        className="flex h-full w-full overflow-hidden" data-cy="panel-container">
        <TextProvider>
          <Allotment onChange={handleChange} proportionalLayout={true}>
            <Allotment.Pane
              minSize={isOpening ? sizes.main : DEFAULT_PANEL_WIDTH}
              maxSize={isOpening ? sizes.main : Infinity}
            >
              <div className="flex flex-col h-full">
                <PanelHeader />
                <div className="flex-1">
                  <Allotment proportionalLayout={true}>
                    {contentPanes.map((pane) => <Allotment.Pane className="pl-[1px]">
                      {pane}
                    </Allotment.Pane>)}
                  </Allotment>
                </div>
              </div>
            </Allotment.Pane>
            {showSidebar && <Allotment.Pane preferredSize={SIDEBAR_DEFAULT_WIDTH} minSize={SIDEBAR_DEFAULT_WIDTH} className="pl-[1px]"><SidebarView /></Allotment.Pane>}
          </Allotment>
        </TextProvider>
      </div>
    </div>
  )
})

export default PanelContent
