import React, { FC, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import PanelHeader from '@/components/panel/header/PanelHeader.tsx'
import ImageView from '@/components/panel/views/image/ImageView.tsx'
import { TextProvider } from '@/contexts/TextContext.tsx'
import TextView from '@/components/panel/views/text/TextView.tsx'
import 'allotment/dist/style.css'
import { Allotment, AllotmentHandle } from 'allotment'
import SidebarView from '@/components/panel/views/sidebar/SidebarView.tsx'
import PanelError from '@/components/panel/PanelError.tsx'
import ResizeHandle from '@/components/panel/ResizeHandle.tsx'
import Loading from '@/components/ui/loading.tsx'
import { useTranslation } from 'react-i18next'

const PanelContent: FC = React.memo(() => {
  const { init, panelState, resizer, error, loading } = usePanel()
  const { t } = useTranslation()
  const [showSidebarContent, setShowSidebarContent] = useState(panelState.showSidebar)
  const [contentPanes, setContentPanes] = useState([])
  const allotmentRef = useRef<AllotmentHandle>(null)
  console.log('re-render')

  const visibleCount = panelState.panelViews.filter(v => v.visible ?? true).length
  // equal preferred size is computed before rendering - when we call allotment.reset() -> Allotment uses the updated preferred sizes
  const equalPreferredSize = visibleCount > 0 ? `${100 / visibleCount}%` : '100%'

  useEffect(() => {
    const panes = panelState.panelViews.map((v, i) => {
      const key = `${v.view}-${v.label || 'default'}-${i}`
      const visible = v.visible ?? true
      if (v.view === 'image') return <ImageView key={key} />
      else return <TextView key={key} viewIndex={i} visible={visible} />
    })

    allotmentRef.current?.reset()
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


  if (error && !loading) return <PanelError error={error} resetErrorBoundary={() =>  init(panelState.config)} />

  return (<TextProvider>
    <div
      className={`h-full flex flex-col relative overflow-hidden`} style={{
        '--sash-hover-size': '2px',
        '--focus-border': 'rgb(var(--tido-color-primary))'
      } as React.CSSProperties}>
      <div className="h-full w-full overflow-hidden relative" data-cy="panel-container">
        {loading &&
          <div className="absolute inset-0 flex justify-center top-[30%] z-10">
            <div className="text-center">
              {t('loading_panel_data')}
              <div><Loading size={36} /></div>
            </div>
          </div>
        }
        <div className="main-content flex flex-col h-full @container/panel">
          <PanelHeader />
          {!loading && <>
            <div className="flex-1">
              <Allotment ref={allotmentRef} proportionalLayout={true}>
                {contentPanes.map((pane, index) => {
                  const visible = panelState.panelViews[index]?.visible ?? true
                  return <Allotment.Pane key={pane.key} visible={visible} preferredSize={equalPreferredSize}>
                    {pane}
                  </Allotment.Pane>
                })}
              </Allotment>
            </div>
          </>}
        </div>
        <div className="sidebar absolute h-full top-0">
          <div className={`absolute ${panelState.showSidebar ? 'inset-y-0' : ''} left-0 w-px bg-border z-40`} />
          { showSidebarContent && <ResizeHandle className="-left-1.5 z-50" data-sidebar-resize-handle /> }
          { showSidebarContent && <SidebarView /> }
        </div>
      </div>
    </div>
  </TextProvider>
  )
})

export default PanelContent
