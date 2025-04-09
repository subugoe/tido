import { FC, useEffect, useState } from 'react'

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


  const collections = useDataStore(state => state.collections)
  const setTreeNodes = useDataStore(state => state.setTreeNodes)

  const [ready, setReady] = useState(false)


  useEffect(() => {
    async function initConfig() {
      await useConfigStore.getState().addCustomConfig(customConfig)
      setReady(true)
    }

    async function initTree(collections: CollectionMap) {
      const nodes = await createCollectionNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree(collections)
    initConfig()
  }, [collections])

  if (!ready) return <div> Loading ...</div>
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
