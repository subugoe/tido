import React, { FC, useEffect, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import PanelHeader from '@/components/panel/PanelHeader.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'
import { TextProvider } from '@/contexts/TextContext.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import 'allotment/dist/style.css'
import { Allotment } from 'allotment'
import SidebarView from '@/components/panel/views/SidebarView.tsx'
import PanelError from '@/components/panel/PanelError.tsx'
import ResizeHandle from '@/components/panel/ResizeHandle.tsx'

const PanelContent: FC = React.memo(() => {
  const { panelState, resizer, error } = usePanel()
  const [showSidebarContent, setShowSidebarContent] = useState(panelState.showSidebar)
  const [contentPanes, setContentPanes] = useState([])

  useEffect(() => {
    const panes = panelState.panelViews.map((v, i) => {
      const key = `${v.view}-${v.label || 'default'}`
      const visible = v.visible ?? true
      if (v.view === 'image') return <ImageView key={key} />
      else return <TextView key={key} viewIndex={i} visible={visible} />
    })

    setContentPanes(panes)

  }, [panelState.panelViews])

  useEffect(() => {
    if (!resizer) return
    resizer.setShowSidebar(panelState.showSidebar)

    let sidebarContentTimeout = null

    if (panelState.showSidebar) {
      // Set flag that displays sidebar pane after the panel shell transition has finished
      sidebarContentTimeout = setTimeout(() => {
        setShowSidebarContent(true)
      }, 200)
    } else {
      setShowSidebarContent(false)
    }

    return () => {
      if (sidebarContentTimeout) clearTimeout(sidebarContentTimeout)
    }
  }, [panelState.showSidebar])


  if (error) return <PanelError error={error} resetErrorBoundary={() => {}} />
  return (
    <TextProvider>
      <div
        className={`h-full flex flex-col relative overflow-hidden`} style={{
          '--sash-hover-size': '2px',
          '--focus-border': 'rgb(var(--tido-color-primary))'
        } as React.CSSProperties}>
        <div className="h-full w-full overflow-hidden relative" data-cy="panel-container">
          <div className="main-content flex flex-col h-full @container/panel">
            <PanelHeader />
            <div className="flex-1">
              <Allotment proportionalLayout={true}>
                {contentPanes.map((pane, index) => {
                  const visible = panelState.panelViews[index]?.visible ?? true
                  return <Allotment.Pane key={pane.key} visible={visible}>
                    {pane}
                  </Allotment.Pane>
                })}
              </Allotment>
            </div>
          </div>
          <div className="sidebar absolute h-full top-0">
            <div className="absolute inset-y-0 left-0 w-px bg-border z-40" />
            { showSidebarContent && <ResizeHandle className="-left-1.5 z-50" data-sidebar-resize-handle /> }
            { showSidebarContent && <SidebarView /> }
          </div>
        </div>
      </div>
    </TextProvider>
  )
})

export default PanelContent
