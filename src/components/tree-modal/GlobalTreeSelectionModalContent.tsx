import { FC } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'


const GlobalTreeSelectionModalContent: FC = () => {

  const panels = configStore(state => state.config.panels)


  return (<div className="t-bg-blue">
    Pop over shown

  </div>)
}

export default GlobalTreeSelectionModalContent
