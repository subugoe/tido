import { getItemIndices } from '@/utils/tree'
import { create } from 'zustand'



interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (newPanelConfig: PanelConfig) => void,

}

export const configStore = create<ConfigStoreType>((set, get) => ({

  config: {},
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
  },
  addNewPanel: (newPanelConfig: PanelConfig) => {

    let newConfig = { ...get().config }
    if (newPanelConfig) newConfig.panels?.push(newPanelConfig)

    set({ config: newConfig })
  }
}))
