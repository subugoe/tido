import { create } from 'zustand'

interface UIStoreTypes {
  showSelectViewPopover: boolean,
  enabledSelectViewPopover: boolean,
  newestPanelId: string,
  updateShowSelectViewPopover: (show: boolean) => void,
  updateEnabledSelectViewPopover: (show: boolean) => void,
  updateNewestPanelId: (newPanelId: string) => void,
}


export const useUIStore = create<UIStoreTypes>((set) => ({
  showSelectViewPopover: false,
  enabledSelectViewPopover: true,
  newestPanelId: '',
  updateShowSelectViewPopover: (show: boolean) => {
    set({ showSelectViewPopover: show })
  },
  updateEnabledSelectViewPopover: (show: boolean) => {
    set({ enabledSelectViewPopover: show })
  },
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  },
}))
