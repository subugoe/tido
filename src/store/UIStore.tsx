import { create } from 'zustand'
import { PanelMode } from '@/types'

interface UIStoreTypes {
  showSelectPanelMode: boolean,
  enabledSelectPanelMode: boolean,
  newestPanelId: string,
  defaultPanelMode: PanelMode,
  updateShowSelectPanelMode: (show: boolean) => void,
  updateEnabledSelectPanelMode: (show: boolean) => void,
  updateNewestPanelId: (newPanelId: string) => void,
  updatePanelMode: (mode: PanelMode) => void,
}

export const useUIStore = create<UIStoreTypes>((set) => ({
  showSelectPanelMode: false,
  enabledSelectPanelMode: true,
  newestPanelId: '',
  defaultPanelMode: 'swap',
  updateShowSelectPanelMode: (show: boolean) => {
    set({ showSelectPanelMode: show })
  },
  updateEnabledSelectPanelMode: (show: boolean) => {
    set({ enabledSelectPanelMode: show })
  },
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  },
  updatePanelMode: (newPanelMode: PanelMode) => {
    set({ defaultPanelMode: newPanelMode })
  }
}))
