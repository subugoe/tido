import { create } from 'zustand'
import { defaultConfig } from '@/utils/config/default-config.ts'

interface ConfigStoreType {
  config: AppConfig,
  addCustomConfig: (customConfig: AppConfig) => void,
  addNewPanel: (newPanelConfig: PanelConfig) => void,
  updatePanel: (newPanelConfig: Partial<PanelConfig>, index: number) => void,
}

export const useConfigStore = create<ConfigStoreType>((set, get) => ({
  config: defaultConfig,
  addCustomConfig: (config: AppConfig) => {
    set({ config })
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
