import { FC, useEffect } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import { createCollectionNodes } from '@/utils/tree.ts'
import PanelsWrapper from '@/components/PanelsWrapper.tsx'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  useConfigStore.getState().addCustomConfig(customConfig)

  const collections = useDataStore(state => state.collections)
  const setTreeNodes = useDataStore(state => state.setTreeNodes)


  useEffect(() => {
    async function initTree(collections: CollectionMap) {
      const nodes = await createCollectionNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree(collections)
  }, [collections])

  return (
    <div className="tido t-flex t-flex-col t-h-full" data-cy="app">
      <TopBar />
      <div className="t-flex-1 t-flex t-overflow-hidden">
        <GlobalTree />
        <PanelsWrapper />
      </div>
    </div>
  )
}

export default App
