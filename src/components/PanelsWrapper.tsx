import { FC } from 'react'

import Panel from '@/components/panel/Panel'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { PanelProvider } from '@/contexts/PanelContext.tsx'
import AddPanel from '@/components/panel/AddPanel.tsx'
const PanelsWrapper: FC = () => {
  const config = useConfigStore(state => state.config)

  return <div className="t-flex t-min-w-full t-h-full t-flex-row t-py-4 t-space-x-4 t-overflow-x-auto">
    {
      (config.panels ?? [])
        .map((panelConfig, i: number) => (
          <PanelProvider panelConfig={panelConfig} index={i} key={i}>
            <Panel />
          </PanelProvider>
        ))
    }
    { !config.panels.length && <AddPanel /> }
  </div>
}

export default PanelsWrapper
