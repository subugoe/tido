import { create } from 'zustand'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { PanelConfig, TidoConfig } from '@/types'

interface ConfigStoreType {
  config: TidoConfig,
  addCustomConfig: (customConfig: TidoConfig) => void,
  addRootCollection: (newRootCollection: string) => void,
  addNewPanel: (newPanelConfig: PanelConfig) => void,
  updatePanel: (newPanelConfig: Partial<PanelConfig>, index: number) => void,
  removePanel: (index: number) => void
}

export const useConfigStore = create<ConfigStoreType>((set, get) => ({
  config: defaultConfig,
  addCustomConfig: (config: TidoConfig) => {
    set({ config })
  },
  addRootCollection: (newRootCollection: string) => {
    set({
      config: {
        ...get().config,
        ['rootCollections']: [
          ...get().config.rootCollections,
          newRootCollection
        ]
      }
    })
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
  },
  removePanel: (index: number) => {
    const newConfig = { ...get().config }
    newConfig.panels = newConfig.panels.filter((_, i) => i !== index)
    set({ config: newConfig })
  }
}))
