import { FC, useEffect } from 'react'

import { configStore } from '@/store/ConfigStore.tsx'
import { dataStore } from '@/store/DataStore.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import { createCollectionNodes } from '@/utils/tree.ts'
import PanelsWrapper from '@/components/PanelsWrapper.tsx'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  const addCustomConfig = configStore((state) => state.addCustomConfig)
  addCustomConfig(customConfig)

  const collections = dataStore(state => state.collections)
  const setTreeNodes = dataStore(state => state.setTreeNodes)


  useEffect(() => {
    async function initTree(collections: CollectionMap) {
      const nodes = await createCollectionNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree(collections)
  }, [collections])

  return (
    <div className="tido t-flex t-flex-col">
      <TopBar />
      <div className="t-flex t-overflow-hidden">
        <GlobalTree />
        <PanelsWrapper />
      </div>
    </div>
  )
}

export default App
