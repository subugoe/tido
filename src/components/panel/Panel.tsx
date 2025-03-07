import React, { FC, useEffect, useState } from 'react'

import PanelCentralContent from '@/components/panel/views/PanelCentralContent'
import PanelHeader from '@/components/panel/PanelHeader.tsx'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useScrollStore } from '@/store/ScrollStore.tsx'
import ScrollPanelMenu from '@/components/panel/ScrollPanelMenu.tsx'

const Panel: FC = React.memo(() => {
  const { panelId } = usePanel()
  const scrollPanelIds = useScrollStore(state => state.panelIds)
  const [isScrollPanel, setIsScrollPanel] = useState(false)

  useEffect(() => {
    setIsScrollPanel(panelId ? scrollPanelIds.includes(panelId) : false)
  }, [scrollPanelIds, panelId])

  return (
    <div
      className={
        `panel t-relative t-flex t-flex-col t-w-[600px] t-border-solid t-border-2 t-rounded-lg t-p-3 t-px-4
        ${isScrollPanel ? 't-border-amber-300 t-ring-4 t-ring-amber-50' : 't-border-slate-200' }
      `}
    >
      {isScrollPanel && <ScrollPanelMenu className="t-absolute t-top-0 t-left-1/2 -t-translate-x-1/2" /> }
      <PanelHeader />
      <PanelCentralContent />
    </div>
  )
})

export default Panel
