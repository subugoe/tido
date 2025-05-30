import { create } from 'zustand'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { TidoConfig } from '@/types'

interface ConfigStoreType {
  config: TidoConfig,
  addCustomConfig: (customConfig: TidoConfig) => void,
  addRootCollection: (newRootCollection: string) => void,
  updateConfig: (data: Partial<TidoConfig>) => void,
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
  updateConfig( data: Partial<TidoConfig>) {
    set({
      config: { ...get().config, ...data }
    })
  },
}))
