import PanelsWrapper from './components/PanelsWrapper'
import { FC, useState } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  const addCustomConfig = configStore((state) => state.addCustomConfig)
  addCustomConfig(customConfig)

  const [showGlobalTree, setShowGlobalTree] = useState(false)

  return (
    <div className="tido t-flex t-flex-col">
      <TopBar setShowGlobalTree={setShowGlobalTree}/>
      <div className="t-flex">
        {showGlobalTree && <GlobalTree/>}
        <PanelsWrapper/>
      </div>
    </div>
  )
}

export default App
