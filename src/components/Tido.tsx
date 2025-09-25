import { FC, useEffect } from 'react'

import { useConfigStore } from '@/store/ConfigStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

import TopBar from '@/components/header/TopBar.tsx'
import GlobalTree from '@/components/tree/GlobalTree.tsx'

import { createCollectionNodes } from '@/utils/tree.ts'
import PanelsWrapper from '@/components/PanelsWrapper.tsx'
import { getRGBColor } from '@/utils/colors.ts'
import { mergeAndValidateConfig } from '@/utils/config/config.ts'
import { initI18n } from '@/utils/translations.ts'
import { TidoConfig, TidoProps } from '@/types'
import { ThemeProvider } from '@/contexts/ThemeContext.tsx'
import { useUIStore } from '@/store/UIStore.tsx'
import { Toaster } from 'sonner'

function createThemeStyles(config: TidoConfig) {
  const { theme } = config
  let styleEl = document.getElementById('tido-theme')

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'tido-theme'
    document.head.appendChild(styleEl)
  }

  styleEl.innerHTML = `.tido {${getRGBColor(theme.primaryColor, 'primary')}}`
}

export const Tido: FC<TidoProps> = ({ config: customConfig }) => {
  const { config, errors } = mergeAndValidateConfig(customConfig)
  if (Object.keys(errors).length > 0) console.error(errors)

  initI18n(config.translations, config.lang)

  createThemeStyles(config)

  useConfigStore.getState().addCustomConfig(config)
  useUIStore.getState().updatePanelMode(config.panelModes.includes(config.defaultPanelMode) ? config.defaultPanelMode : config.panelModes[0])

  const setTreeNodes = useDataStore(state => state.setTreeNodes)


  useEffect(() => {
    async function initTree(rootCollections: string[]) {
      const nodes = await createCollectionNodes(rootCollections)
      if (!nodes) return

      // add rootCollection in Collections map
      for (const collection of rootCollections) {
        await useDataStore.getState().initCollection(collection)
      }

      setTreeNodes(nodes)
    }

    initTree(config.rootCollections)
  }, [])


  return (
    <div className="tido flex flex-col h-full" data-cy="app">
      <ThemeProvider>
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <GlobalTree />
          <PanelsWrapper />
          <Toaster position="bottom-center" richColors expand={true}  />
        </div>
      </ThemeProvider>
    </div>
  )
}
