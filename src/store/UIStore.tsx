import { create } from 'zustand'

interface UIStoreTypes {
  showSelectViewPopover: boolean,
  updateShowSelectViewPopover: (show: boolean) => void,
  enabledSelectViewPopover: boolean,
  updateEnabledSelectViewPopover: (show: boolean) => void,
}


export const useUIStore = create<UIStoreTypes>((set) => ({
  showSelectViewPopover: false,
  updateShowSelectViewPopover: (show: boolean) => {
    set({ showSelectViewPopover: show })
  },
  enabledSelectViewPopover: true,
  updateEnabledSelectViewPopover: (show: boolean) => {
    set({ enabledSelectViewPopover: show })
  }
}))
