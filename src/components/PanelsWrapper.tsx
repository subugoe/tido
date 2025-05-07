import { FC, useEffect } from 'react'
import Panel from '@/components/panel/Panel'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { PanelProvider } from '@/contexts/PanelContext.tsx'
import AddPanel from '@/components/panel/AddPanel.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'


const PanelsWrapper: FC = () => {
  const config = useConfigStore(state => state.config)
  const panels = usePanelStore(state => state.panels)
  const initializePanels = usePanelStore(state => state.initializePanels)

  useEffect(() => {
    initializePanels(config.panels)
  }, [config.panels])

  return <div id="panels-wrapper" className="t-flex-1 t-flex t-h-full t-py-4 t-space-x-4 t-overflow-x-auto" data-cy="panels-wrapper">
    {
      panels.map((state) => (
        <PanelProvider panelId={state.id} key={state.id}>
          <Panel />
        </PanelProvider>
      ))
    }
    <AddPanel />
  </div>
}

export default PanelsWrapper
