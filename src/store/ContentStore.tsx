import { create } from 'zustand'

interface VisiblePanels {
  [id: string]: PanelContentStore
}

interface ContentStoreTypes {
    openedPanels: VisiblePanels // or panels: each panel has one opened item 
    addPanelContent: (id: string, newPanel: PanelContentStore) => void,
    updatePanels: (panelId: string, updatedItem: PanelContentStore) => void,
    updateContentToggleIndex: (panelIndex: string, newContentIndex: number) => void,
    updateTextViewIndex: (panelId: string, newTextIndex: number) => void,
    getPanel: (panelId: string) => PanelContentStore | null,
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  openedPanels: {}, 

  addPanelContent: (id: string, newPanel: PanelContentStore) => {
    const newPanels = { ...get().openedPanels }
    newPanels[id] = newPanel
    set({ openedPanels: newPanels })
  },

  updateContentToggleIndex: (panelId: string, newContentIndex: number) => {
    const panel = get().getPanel(panelId)
    if (!panel) return // TODO: add error handling

    panel.contentIndex = newContentIndex
    get().updatePanels(panelId, panel)
  },

  updateTextViewIndex: (panelId: string, newTextViewIndex: number) => {
    const panel = get().getPanel(panelId)
    if (!panel) return // TODO: add error handling

    panel.textViewIndex = newTextViewIndex
    get().updatePanels(panelId, panel)
  },

  updatePanels: (panelId: string, updatedPanel: PanelContentStore) => {
    const newPanels = { ...get().openedPanels }
    newPanels[panelId] = updatedPanel
    set({ openedPanels: newPanels })
  },

  getPanel: (panelId: string) => {
    if (!(panelId in get().openedPanels)) return null
    return get().openedPanels[panelId]
  }
}))