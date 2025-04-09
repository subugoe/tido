import { create } from 'zustand'
import i18n from 'i18next'

import { defaultConfig } from '@/utils/config/default-config.ts'
import { mergeAndValidateConfig } from '@/utils/config/config.ts'
import { initI18n } from '@/utils/translations.ts'

interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (newPanelConfig: PanelConfig) => void,
  updatePanel: (newPanelConfig: Partial<PanelConfig>, index: number) => void,
}

export const useConfigStore = create<ConfigStoreType>((set, get) => ({
  config: defaultConfig,
  addCustomConfig: async (userConfig: Config) => {
    const { config, errors } = await mergeAndValidateConfig(userConfig)
    if (Object.keys(errors).length > 0) console.error(errors)
    set({ config })

    const lang = (config.lang) as string
    const translationsI18n = { [lang]: { ['translation']: config.translations?.[lang] as Translation } }
    await initI18n(translationsI18n)
    i18n.changeLanguage(config.lang)
  },
  addNewPanel: (newPanelConfig: PanelConfig) => {
    const newConfig = { ...get().config }
    newConfig.panels?.push(newPanelConfig)

    set({ config: newConfig })
  },
  updatePanel: (newPanelConfig: Partial<PanelConfig>, index: number) => {
    const newConfig = { ...get().config }
    if (newConfig.panels) newConfig.panels[index] = {
      ...newConfig.panels[index],
      ...newPanelConfig
    }

    set({ config: newConfig })
  }
}))
