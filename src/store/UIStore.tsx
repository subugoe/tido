import { create } from 'zustand'

interface UIStoreTypes {
  newestPanelId: string,
  updateNewestPanelId: (newPanelId: string) => void,
}

export const useUIStore = create<UIStoreTypes>((set) => ({
  newestPanelId: '',
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  }
}))
