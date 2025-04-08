import { create } from 'zustand'

interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (newPanelConfig: PanelConfig) => void,
  updatePanel: (newPanelConfig: Partial<PanelConfig>, index: number) => void,
}

export const useConfigStore = create<ConfigStoreType>((set, get) => ({
  config: {
    container: '#app',
    theme: {
      primaryColor: ''
    },
    lang: 'de',
    translations: {
      de: {
        'new': 'Neu',
        'sync_panels': 'Panels synkronisieren'
      },
      en: {
        'new': 'New',
        'sync_panels': 'Sync Panels',
        'place': 'Place',
        'year': 'Year',
        'author': 'Author',
        'editor': 'Editor'
      }
    }
  },
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
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
