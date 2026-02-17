import { createContext, useContext, useEffect, useState } from 'react'
import { TidoConfig } from '@/types'
import { mergeAndValidateConfig } from '@/utils/config/config.ts'
import { promiseWithCache } from '@/utils/promise-cache.ts'
import { getAppPrimaryAndForegroundColor } from '@/utils/colors.ts'
import { useUIStore } from '@/store/UIStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { initI18n } from '@/utils/translations.ts'
import Loading from '@/components/ui/loading.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'

type ConfigProviderProps = {
  children: React.ReactNode
  userConfig?: Partial<TidoConfig>
}

function createThemeStyles(config: TidoConfig) {
  const { theme } = config
  let styleEl = document.getElementById('tido-theme')

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'tido-theme'
    document.head.appendChild(styleEl)
  }

  styleEl.innerHTML = `.tido {${getAppPrimaryAndForegroundColor(theme.primaryColor, 'primary')}}`
}

const ConfigContext = createContext(null)

export const ConfigProvider = ({ userConfig, children }: ConfigProviderProps) => {

  const [config, setConfig] = useState<TidoConfig>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const createTreeNodes = useDataStore.getState().createTreeNodes


  useEffect(() => {
    async function initApp() {
      setLoading(true)
      const { config, errors } = await mergeAndValidateConfig(userConfig, defaultConfig)
      if (Object.keys(errors).length > 0) console.error(errors)
      initI18n(config.translations, config.lang)
      createThemeStyles(config)

      useUIStore.getState().updatePanelMode(config.panelModes.includes(config.defaultPanelMode) ? config.defaultPanelMode : config.panelModes[0])

      createTreeNodes(config.rootCollections)

      // add rootCollection in Collections map
      config.rootCollections.forEach((collectionUrl, i) => {
        promiseWithCache(`initCollection${i}`, () => useDataStore.getState().initCollection(collectionUrl))
      })

      setConfig(config)
      setLoading(false)
    }

    initApp()
  }, [userConfig])


  if (loading) {
    return <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading size={36} />
    </div>
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const context = useContext(ConfigContext)

  if (context === undefined)
    throw new Error('useConfig must be used within a AppProvider')

  return context
}
