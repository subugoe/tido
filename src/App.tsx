import PanelsWrapper from './components/PanelsWrapper'
import { FC, useEffect, useState } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'
import { dataStore } from '@/store/DataStore.tsx'
import { getTreeNodes } from '@/utils/tree.ts'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  const addCustomConfig = configStore((state) => state.addCustomConfig)
  addCustomConfig(customConfig)

  const collections = dataStore(state => state.collections)
  const setTreeNodes = dataStore(state => state.setTreeNodes)

  const [showGlobalTree, setShowGlobalTree] = useState(false)

  useEffect(() => {
    async function initTree(collections: CollectionMap) {
      const nodes = await getTreeNodes(collections)
      if (!nodes) return
      
      setTreeNodes(nodes)
    }

    initTree(collections)
  }, [collections])

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
