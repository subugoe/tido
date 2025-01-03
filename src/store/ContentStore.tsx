import { create } from 'zustand'

interface ContentStoreTypes {
    openedPanels: ItemStore[] // or panels: each panel has one opened item 
    initItemData: (newPanel: ItemStore) => void,
    updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => void,
    updateTextViewIndex: (panelIndex: number, newTextViewIndex: number) => void
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  openedPanels: [], 

  initItemData: (newPanel: ItemStore) => {
    let newPanels = [...get().openedPanels]
    newPanels.push(newPanel)
    set({openedPanels: newPanels})
  },

  updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => {
    let item = [...get().openedPanels][panelIndex] // or panel
    item.t = newContentIndex

    let newItems = [...get().openedPanels]
    newItems[panelIndex] = item
    set({openedPanels: newItems})
  },

  updateTextViewIndex: (panelIndex: number, newTextViewIndex: number) => {
    let item = [...get().openedPanels][panelIndex] // or panel
    item.v = newTextViewIndex

    let newItems = [...get().openedPanels]
    newItems[panelIndex] = item
    set({openedPanels: newItems})
  }

}))