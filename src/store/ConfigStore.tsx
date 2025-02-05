import { create } from 'zustand'

interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (newPanelConfig: PanelConfig) => void,
  updatePanel: (newPanelConfig: PanelConfig, newIndex: number) => void,
}

export const configStore = create<ConfigStoreType>((set, get) => ({

  config: {},
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
  },
  addNewPanel: (newPanelConfig: PanelConfig) => {
    const newConfig = { ...get().config }
    newConfig.panels?.push(newPanelConfig)

    set({ config: newConfig })
  },

  updatePanel: (newPanelConfig: PanelConfig, newIndex: number) => {
    const newConfig = { ...get().config }
    if (newConfig.panels) newConfig.panels[newIndex] = newPanelConfig
    
    set({ config: newConfig })
  }
}))
