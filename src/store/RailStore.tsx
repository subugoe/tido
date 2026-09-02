import { create } from 'zustand'

export type RailView = 'tree' | 'add' | 'settings'

interface RailStoreType {
  activeView: RailView | null
  setActiveView: (view: RailView | null) => void
  toggleView: (view: RailView) => void
}

export const useRailStore = create<RailStoreType>((set, get) => ({
  activeView: null,
  setActiveView: (view: RailView | null) => set({ activeView: view }),
  toggleView: (view: RailView) => {
    set({ activeView: get().activeView === view ? null : view })
  }
}))
