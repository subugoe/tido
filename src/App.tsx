import PanelsWrapper from './components/PanelsWrapper'
import { FC } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  const addCustomConfig = configStore((state) => state.addCustomConfig)
  addCustomConfig(customConfig)

  return (
    <div className="tido t-flex t-flex-col">
      <PanelsWrapper />
    </div>
  )
}

export default App
