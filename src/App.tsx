import { FC, useEffect } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import { createCollectionNodes } from '@/utils/tree.ts'
import PanelsWrapper from '@/components/PanelsWrapper.tsx'
import { getRGBColor } from '@/utils/colors.ts'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { mergeAndValidateConfig } from '@/utils/config/config.ts'
import { initI18n } from '@/utils/translations.ts'


interface AppProps {
  customConfig: Partial<AppConfig>
}

function createThemeStyles(config: AppConfig) {
  const { container, theme } = config
  const style = document.createElement('style')
  style.innerHTML = `${container || defaultConfig.container} {${getRGBColor(theme.primaryColor, 'primary')}}`
  document.head.appendChild(style)
}

const App: FC<AppProps> = ({ customConfig }) => {
  const { config, errors } = mergeAndValidateConfig(customConfig)
  if (Object.keys(errors).length > 0) console.error(errors)

  initI18n(config.translations, config.lang)

  createThemeStyles(config)

  useConfigStore.getState().addCustomConfig(config)

  const treeCollections = useDataStore(state => state.treeCollections)
  const setTreeNodes = useDataStore(state => state.setTreeNodes)


  useEffect(() => {
    async function initTree(collections: CollectionMap) {
      const nodes = await createCollectionNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    initTree(treeCollections)
  }, [treeCollections])


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
