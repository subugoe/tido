import { create } from 'zustand'

interface ContentStoreTypes {
    openedPanels: PanelContentStore[] // or panels: each panel has one opened item 
    addPanelContent: (newPanel: PanelContentStore) => void,
    updatePanels: (panelIndex: number, updatedItem: PanelContentStore) => void,
    updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => void,
    updateTextViewIndex: (panelIndex: number, newTextViewIndex: number) => void,
    getPanel: (panelIndex: number) => PanelContentStore | null,
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  openedPanels: [], 

  addPanelContent: (newPanel: PanelContentStore) => {
    let newPanels = [...get().openedPanels]
    newPanels.push(newPanel)
    set({openedPanels: newPanels})
  },

  updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => {
    let panel = get().getPanel(panelIndex)
    if (!panel) return // TODO: add error handling

    panel.t = newContentIndex
    get().updatePanels(panelIndex, panel)
  },

  updateTextViewIndex: (panelIndex: number, newTextViewIndex: number) => {
    let panel = get().getPanel(panelIndex)
    if (!panel) return // TODO: add error handling

    panel.v = newTextViewIndex
    get().updatePanels(panelIndex, panel)
  },

  updatePanels: (panelIndex: number, updatedPanel: PanelContentStore) => {
    let newPanels = [...get().openedPanels]
    newPanels[panelIndex] = updatedPanel
    set({openedPanels: newPanels})
  },

  getPanel: (panelIndex: number) => {
    if (panelIndex < 0) return null
    if (panelIndex > get().openedPanels.length - 1) return null

    return get().openedPanels[panelIndex]
  }
}))