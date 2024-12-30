import { create } from 'zustand'
import { request } from '@/utils/http'

interface ContentStoreTypes {
    openedPanels: ItemStore[] // or panels: each panel has one opened item 
    initItemData: (newItemData: Item, primaryColor: string) => void,
    updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => void,
    updateTextViewIndex: (panelIndex: number, newTextViewIndex: number) => void
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  openedPanels: [], 

  initItemData: (newItemData: Item, primaryColor: string) => {
    let newItems = [...get().openedPanels]
    newItems.push({item: newItemData, t:0, v:0, primaryColor: primaryColor})
    set({openedPanels: newItems})
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