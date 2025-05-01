import { FC } from 'react'

import Panel from '@/components/panel/Panel'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { PanelProvider } from '@/contexts/PanelContext.tsx'
import AddPanel from '@/components/panel/AddPanel.tsx'
const PanelsWrapper: FC = () => {
  const config = useConfigStore(state => state.config)

  return <div id="panels-wrapper" className="t-flex-1 t-flex t-h-full t-py-4 t-space-x-4 t-overflow-x-auto" data-cy="panels-wrapper">
    {
      (config.panels ?? [])
        .map((panelConfig, i: number) => (
          <PanelProvider panelConfig={panelConfig} index={i} key={i}>
            <Panel />
          </PanelProvider>
        ))
    }
    <AddPanel />
  </div>
}

export default PanelsWrapper
