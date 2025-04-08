import { FC, useEffect, useState } from 'react'
import i18n from 'i18next'

import { useConfigStore } from '@/store/ConfigStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import TopBar from '@/components/TopBar'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import { createCollectionNodes } from '@/utils/tree.ts'
import PanelsWrapper from '@/components/PanelsWrapper.tsx'

import  initI18n  from '@/i18n'
import enDefaultTranslations from '../public/translations/en.json'
import deDefaultTranslations from '../public/translations/de.json'

interface AppProps {
  customConfig: Config
}

const App: FC<AppProps> = ({ customConfig }) => {
  useConfigStore.getState().addCustomConfig(customConfig)

  const collections = useDataStore(state => state.collections)
  const setTreeNodes = useDataStore(state => state.setTreeNodes)
  const [ready, setReady] = useState(false)


  useEffect(() => {
    async function initTree(collections: CollectionMap) {
      const nodes = await createCollectionNodes(collections)
      if (!nodes) return

      setTreeNodes(nodes)
    }

    async function initApp() {
      initTree(collections)
      const lang = customConfig.lang ?? 'en'
      const translationsInConfig =  customConfig.translations[lang]

      let translations = {}
      if (lang === 'en') translations = { ...enDefaultTranslations , ...translationsInConfig }
      if (lang === 'de') translations = { ...deDefaultTranslations, ...translationsInConfig }

      await initI18n({
        [lang]: { translation: translations }
      })
      await i18n.changeLanguage(customConfig.lang)
      setReady(true)
    }

    initApp()
  }, [collections])
  if (!ready) return <div> Loading Translations ... </div>

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
