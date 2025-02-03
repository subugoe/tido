import { FC } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'


const GlobalTreeSelectionModalContent: FC = () => {

  const panels = configStore(state => state.config.panels)


  return <div className="t-ml-4 t-mt-40 t-z-50 t-bg-blue">
    Pop over shown

  </div>
}

export default GlobalTreeSelectionModalContent
