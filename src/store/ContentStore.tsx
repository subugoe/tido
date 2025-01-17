import { create } from 'zustand'

interface PanelStates {
  [id: string]: PanelState
}

interface ContentStoreTypes {
  panels: PanelStates // or panels: each panel has one opened item
  activeManifestsLabels: string[]
  addPanelContent: (id: string, newPanel: PanelState) => void
  updatePanels: (panelId: string, updatedItem: PanelState) => void
  updateContentToggleIndex: (panelIndex: string,newContentIndex: number) => void
  updateViewIndex: (panelId: string, newViewIndex: number) => void,
  addManifestLabel: (newLabel: string) => void
  getPanel: (panelId: string) => PanelState | null,
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  panels: {},
  activeManifestsLabels: [],
  loading: true,

  addPanelContent: (id: string, newPanel: PanelState) => {
    const newPanels = { ...get().panels }
    newPanels[id] = newPanel
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

  addManifestLabel: (newLabel) => {
    set({activeManifestsLabels: [...get().activeManifestsLabels, newLabel]})
  },

  updatePanels: (panelId: string, updatedPanel: PanelState) => {
    const newPanels = { ...get().panels }
    newPanels[panelId] = updatedPanel
    set({ panels: newPanels })
  },

  getPanel: (panelId: string) => {
    if (!(panelId in get().panels)) return null
    return get().panels[panelId]
  }

}))
