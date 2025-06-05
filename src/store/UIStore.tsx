import { create } from 'zustand'
import { ViewType } from '@/types'

interface UIStoreTypes {
  showSelectTextView: boolean,
  enabledSelectTextView: boolean,
  newestPanelId: string,
  defaultView: ViewType,
  updateShowSelectTextView: (show: boolean) => void,
  updateEnabledSelectTextView: (show: boolean) => void,
  updateNewestPanelId: (newPanelId: string) => void,
  updateView: (view: ViewType) => void,
}

export const useUIStore = create<UIStoreTypes>((set) => ({
  showSelectTextView: false,
  enabledSelectTextView: true,
  newestPanelId: '',
  defaultView: 'pip',
  updateShowSelectTextView: (show: boolean) => {
    set({ showSelectTextView: show })
  },
  updateEnabledSelectTextView: (show: boolean) => {
    set({ enabledSelectTextView: show })
  },
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  },
  updateView: (newView: ViewType) => {
    set({ defaultView: newView })
  }
}))
