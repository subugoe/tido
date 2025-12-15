import { FC, useEffect } from 'react'
import AddPanel from '@/components/panel/AddPanel.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import Panel from '@/components/panel/Panel.tsx'

const PanelsWrapper: FC = () => {
  const { panels: panelsConfig, showPanelPlaceholder } = useConfig()
  const panels = usePanelStore(state => state.panels)
  const initializePanels = usePanelStore.getState().initializePanels

  useEffect(() => {
    initializePanels(panelsConfig)
  }, [panelsConfig])

  return <div id="panels-wrapper" className="bg-background flex-1 flex h-full py-4 space-x-4 overflow-x-auto pr-2" data-cy="panels-wrapper">
    { panels.map((state) => <Panel state={state} key={state.id} />) }
    { showPanelPlaceholder && <AddPanel /> }
  </div>
}

export default PanelsWrapper
