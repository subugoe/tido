import { create } from 'zustand'
import { request } from '@/utils/http'

interface ContentStoreTypes {
    items: ItemStore[] // or panels: each panel has one opened item 
    initItemData: (newItemData: Item) => void,
    updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => void
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  items: [], 

  initItemData: (newItemData: Item) => {
    let newItems = [...get().items]
    newItems.push({item: newItemData, t:0, v:0})
    set({items: newItems})
  },

  updateContentToggleIndex: (panelIndex: number, newContentIndex: number) => {
    let item = [...get().items][panelIndex] // or panel
    item.t = newContentIndex

    let newItems = [...get().items]
    newItems[panelIndex] = item
    set({items: newItems})
  }

}))