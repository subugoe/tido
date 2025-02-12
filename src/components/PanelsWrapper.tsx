import { FC } from 'react'

import Panel from '@/components/panel/Panel'
import { configStore } from '@/store/ConfigStore.tsx'

const PanelsWrapper: FC = () => {
  const config = configStore(state => state.config)
  const panels = config?.panels
  return <div className="t-flex t-h-full t-flex-row t-py-4 t-space-x-4 t-overflow-x-auto">
    { panels?.map((panelConfig, i: number) => (<Panel config={panelConfig} key={i}/>)) }
  </div>
}

export default PanelsWrapper
