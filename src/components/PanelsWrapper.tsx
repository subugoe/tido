import { FC } from 'react'
import Panel from '@/components/panel/Panel'
import { useConfig } from '@/contexts/ConfigContext'

const PanelsWrapper: FC = () => {
  const { config } = useConfig()

  const openedPanels = config?.panels
  const panels = openedPanels ?
    openedPanels.length > 0 &&
    openedPanels.map((panel: PanelConfig, i: number) => (
      <div key={i} className="t-mr-6">
        <Panel panelConfig={panel} index={i}/>
      </div>
    )): <div> Error with loading panels </div>


  return <div className="t-flex t-flex-row">{panels}</div>
}

export default PanelsWrapper
