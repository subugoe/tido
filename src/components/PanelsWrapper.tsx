import { FC } from 'react'
import Panel from '@/components/panel/Panel'
import { useConfig } from '@/contexts/ConfigContext'

const PanelsWrapper: FC = () => {
  const { config } = useConfig()

  const openedPanels = config?.panels
  const panels = openedPanels ?
    openedPanels.length > 0 &&
    openedPanels.map((panel: PanelConfig, i: number) => (
        <Panel panelConfig={panel} index={i} key={i}/>
    )): <div> Error with loading panels </div>


  return <div className="t-flex t-flex-row t-ml-[6%]">{panels}</div>
}

export default PanelsWrapper
