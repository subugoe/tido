import { create } from 'zustand'
import { PanelMode } from '@/types'

interface UIStoreTypes {
  newestPanelId: string,
  defaultPanelMode: PanelMode,
  updateNewestPanelId: (newPanelId: string) => void,
  updatePanelMode: (mode: PanelMode) => void,
}

export const useUIStore = create<UIStoreTypes>((set) => ({
  newestPanelId: '',
  defaultPanelMode: 'swap',
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  },
  updatePanelMode: (newPanelMode: PanelMode) => {
    set({ defaultPanelMode: newPanelMode })
  }
}))
