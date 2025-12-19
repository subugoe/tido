import { createContext, useContext, use } from 'react'
import { TidoConfig } from '@/types'
import { mergeAndValidateConfig } from '@/utils/config/config.ts'
import { promiseWithCache } from '@/utils/promise-cache.ts'
import { getAppPrimaryAndForegroundColor } from '@/utils/colors.ts'
import { useUIStore } from '@/store/UIStore.tsx'
import { createCollectionNodes } from '@/utils/tree.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { initI18n } from '@/utils/translations.ts'

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
  const { config, errors } = use<{ config: TidoConfig; errors: Record<string, string> }>(promiseWithCache('config', () => mergeAndValidateConfig(userConfig)))
  if (Object.keys(errors).length > 0) console.error(errors)

  initI18n(config.translations, config.lang)
  createThemeStyles(config)

  const setTreeNodes = useDataStore(state => state.setTreeNodes)

  useUIStore.getState().updatePanelMode(config.panelModes.includes(config.defaultPanelMode) ? config.defaultPanelMode : config.panelModes[0])

  const nodes = use<TreeNode[]>(promiseWithCache('createCollectionNodes', () => createCollectionNodes(config.rootCollections)))
  if (!nodes) return

  // add rootCollection in Collections map
  config.rootCollections.forEach((collectionUrl, i) => {
    use(promiseWithCache(`initCollection${i}`, () => useDataStore.getState().initCollection(collectionUrl)))
  })

  setTreeNodes(nodes)
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const context = useContext(ConfigContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a AppProvider')

  return context
}
