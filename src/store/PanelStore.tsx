import { create } from 'zustand'
import { PanelConfig } from '@/types'
import { useUIStore } from '@/store/UIStore.tsx'

interface PanelStoreTypes {
  panels: PanelState[] // or panels: each panel has one opened item
  activeTargetIndex: number
  addPanel: (config: PanelConfig, newPanelId: string) => void
  updatePanel: (id: string, data: Partial<PanelState>) => void
  getPanel: (panelId: string | null) => PanelState | null
  setActiveTargetIndex: (panelId: string, index: number) => void
  removePanel: (panelId: string) => void
  initializePanels: (panelsConfig: PanelConfig[]) => void
}

function getDefaultPanelState(id: string, config: PanelConfig): PanelState {
  return {
    id,
    config,
    collectionId: null,
    item: null,
    manifest: null,
    contentTypes: [],
    contentIndex: config.contentIndex ?? 0,
    mode: useUIStore.getState().defaultPanelMode,
    activeTargetIndex: -1,
    imageExists: false,
    annotationsOpen: false,
    annotations: null
  }
}

export const usePanelStore = create<PanelStoreTypes>((set, get) => ({
  panels: [],
  activeTargetIndex: -1,
  addPanel: (config: PanelConfig, newPanelId) => {
    // TODO: newPanelId should be created here be as a random value. Then one would not create this value each time outside of this function, every time a new panel is created. Instead this function would take care of creating a new panelId
    set({ panels: [ ...get().panels, getDefaultPanelState(newPanelId, config) ] })
  },
  updatePanel(id: string, data: Partial<PanelState>) {
    set({
      panels: get().panels.map(panel => {
        if (panel.id !== id) return panel
        return { ...panel, ...data }
      })
    })
  },
  getPanel: (panelId: string | null) => {
    if (!panelId) return null
    return get().panels.find(({ id }) => panelId === id)
  },
  setActiveTargetIndex: (panelId: string, index: number) => {
    get().updatePanel(panelId, { activeTargetIndex: index })
  },
  removePanel: (panelId: string) => {
    const updatedPanels = get().panels.filter(({ id }) => id !== panelId)
    set({ panels: updatedPanels })
  },
  initializePanels: (configs: PanelConfig[]) =>
    set({
      panels: configs.map((config) => getDefaultPanelState(crypto.randomUUID(), config))
    })
}))
