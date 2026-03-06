import { create } from 'zustand'
import type { ThemeConfig } from '@/types'

type Theme = ThemeConfig['theme']

interface UIStoreTypes {
  newestPanelId: string,
  theme: Theme | null,
  updateNewestPanelId: (newPanelId: string) => void,
  updateTheme: (newTheme: Theme) => void
}

export const useUIStore = create<UIStoreTypes>((set) => ({
  newestPanelId: '',
  theme: null,
  updateNewestPanelId: (newPanelId) => {
    set({ newestPanelId: newPanelId })
  },
  updateTheme(newTheme: Theme) {
    set({ theme: newTheme })
  }
}))
