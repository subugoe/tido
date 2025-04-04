import { FC, useEffect, Suspense, useState } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import './i18n.ts'

import '@/components/InitializeI18n.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import { createCollectionNodes } from '@/utils/tree.ts'
import PanelsWrapper from '@/components/PanelsWrapper.tsx'

import  initI18n  from '@/i18n'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

import { mergeTranslations } from '@/utils/translations.ts'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  const addCustomConfig = useConfigStore((state) => state.addCustomConfig)
  addCustomConfig(customConfig)

  const collections = useDataStore(state => state.collections)
  const setTreeNodes = useDataStore(state => state.setTreeNodes)
  const [ready, setReady] = useState(false)


  useEffect(() => {

    async function initApp() {
      initTree(collections)
      const lang = customConfig.lang
      const tidoTranslations = mergeTranslations(lang, customConfig.translationsDirPath, customConfig.translations[lang])
      // TODO: overwrite the translations into a results translations file
      // TODO: init I18n using the results translations dir path
      await initI18n(customConfig.translationsDirPath)
      await i18n.changeLanguage(customConfig.lang)
      setReady(true)  // after writing the translations in user's translations dir path
    }

    async function initTree(collections: CollectionMap) {
      const nodes = await createCollectionNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }
    initApp()
  }, [collections])

  if (!ready) return <div> Loading ... </div>

  return (
    <div className="tido t-flex t-flex-col t-h-full">
      <TopBar />
      <div className="t-flex-1 t-flex t-overflow-hidden">
        <GlobalTree />
        <PanelsWrapper />
      </div>
    </div>
  )
}

export default App
