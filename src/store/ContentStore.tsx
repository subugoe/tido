import { create } from 'zustand'

interface ContentStoreTypes {
    items: ItemStore[]
    addItemData: (newItemData: Item) => void
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  items: [],

  addItemData: (newItemData: Item) => {
    console.log('items', )
    let newItems = [...get().items]
    newItems.push({item: newItemData})
    console.log('newItems', newItems)
    set({items: newItems})
  }
}))