import { create } from 'zustand'

interface PanelStates {
  [id: string]: PanelState
}

interface PanelStoreTypes {
  panels: PanelStates // or panels: each panel has one opened item
  activeTargetIndex: number
  addPanelContent: (newPanel: PanelState) => void
  updatePanels: (panelId: string, updatedItem: PanelState) => void
  updateContentToggleIndex: (
    panelIndex: string,
    newContentIndex: number
  ) => void
  updateViewIndex: (panelId: string, newViewIndex: number) => void
  getPanel: (panelId: string) => PanelState | null
  setActiveTargetIndex: (panelId: string, index: number) => void
}

export const panelStore = create<PanelStoreTypes>((set, get) => ({
  panels: {},
  activeTargetIndex: -1,
  addPanelContent: (newPanel: PanelState) => {
    const newPanels = { ...get().panels }
    newPanels[newPanel.id] = newPanel
    set({ panels: newPanels })
  },

  updateContentToggleIndex: (panelId: string, newContentIndex: number) => {
    const panel = get().getPanel(panelId)
    if (!panel) return // TODO: add error handling

    panel.contentIndex = newContentIndex
    get().updatePanels(panelId, panel)
  },

  updateViewIndex: (panelId: string, newViewIndex: number) => {
    const panel = get().getPanel(panelId)
    if (!panel) return // TODO: add error handling

    panel.viewIndex = newViewIndex
    get().updatePanels(panelId, panel)
  },

  updatePanels: (panelId: string, updatedPanel: PanelState) => {
    const newPanels = { ...get().panels }
    newPanels[panelId] = updatedPanel
    set({ panels: newPanels })
  },

  getPanel: (panelId: string) => {
    if (!(panelId in get().panels)) return null
    return get().panels[panelId]
  },
  setActiveTargetIndex: (panelId: string, index: number) => {
    const panelState = get().panels[panelId]
    panelState.activeTargetIndex = index
    get().updatePanels(panelId, panelState)
  }
}))
