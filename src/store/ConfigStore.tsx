import { create } from 'zustand'

interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void
}

export const configStore = create<ConfigStoreType>((set) => ({
  config: {},
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
  }
}))
