import { create } from 'zustand'

interface UIStoreTypes {
  showSelectTextView: boolean,
  enabledSelectTextView: boolean,
  newestPanelId: string,
  updateShowSelectTextView: (show: boolean) => void,
  updateEnabledSelectTextView: (show: boolean) => void,
  updateNewestPanelId: (newPanelId: string) => void,
}

export const useUIStore = create<UIStoreTypes>((set) => ({
  showSelectTextView: false,
  enabledSelectTextView: true,
  newestPanelId: '',
  updateShowSelectTextView: (show: boolean) => {
    set({ showSelectTextView: show })
  },
  updateEnabledSelectTextView: (show: boolean) => {
    set({ enabledSelectTextView: show })
  },
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  },
}))
