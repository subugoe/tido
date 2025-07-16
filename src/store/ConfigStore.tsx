import { create } from 'zustand'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { TidoConfig } from '@/types'
import { useUIStore } from '@/store/UIStore.tsx'

interface ConfigStoreType {
  config: TidoConfig,
  addCustomConfig: (customConfig: TidoConfig) => void,
  addRootCollection: (newRootCollection: string) => void
}

export const useConfigStore = create<ConfigStoreType>((set, get) => ({
  config: defaultConfig,
  addCustomConfig: (config: TidoConfig) => {
    useUIStore.getState().updatePanelMode(config.defaultPanelMode)
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
  }
}))
