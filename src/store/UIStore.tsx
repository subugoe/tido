import { create } from 'zustand'

interface UIStoreTypes {
  showSelectViewPopover: boolean,
  updateShowSelectViewPopover: (show: boolean) => void
}


export const useUIStore = create<UIStoreTypes>((set, get) => ({
  showSelectViewPopover: false,
  updateShowSelectViewPopover: (show: boolean) => {
    console.log('updateShowSelectViewPopover', show)
    set({ showSelectViewPopover: show })
  }
}))
