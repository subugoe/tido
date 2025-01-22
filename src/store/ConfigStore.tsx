import { create } from 'zustand'

interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (newPanel: PanelConfig) => void
}

export const configStore = create<ConfigStoreType>((set, get) => ({
  config: {},
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
  },
  addNewPanel: (newPanel: PanelConfig) => {
    let newConfig = {...get().config} 
    newConfig.panels?.push(newPanel)

    set({config: newConfig})
  }
}))
