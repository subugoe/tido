import { create } from 'zustand'

interface ScrollStateMap {
  [key: string]: boolean
}

interface ScrollStoreType {
  panels: ScrollStateMap
  addScrollPanel: (panelId: string) => void
}

export const scrollStore = create<ScrollStoreType>((set, get) => ({
  panels: {},
  addScrollPanel: async (panelId: string) => {
    set({ panels: { ...get().panels, [panelId]: true } })
  },
}))
