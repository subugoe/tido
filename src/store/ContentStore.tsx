import { create } from 'zustand'
import { request } from '@/utils/http'

interface ContentStoreTypes {
    items: ItemStore[]
    addItemData: (newItemData: Item) => void
    getItemTexts: (index: number) => string[],
    addItemTexts: (index: number) => void
}

export const contentStore = create<ContentStoreTypes>((set, get) => ({
  items: [],

  addItemData: (newItemData: Item) => {
    let newItems = [...get().items]
    newItems.push({item: newItemData})
    set({items: newItems})
  },

  getItemTexts: (index: number) => {
    const content = get().items[index].item.content
    let texts: string[] = []
    content.forEach(async (contentItem) => {
        const response = await request<string>(contentItem.url)
        if (response.success) {
            texts.push(response.data) 
        }
    })

    return texts
  },

  addItemTexts: (index: number) => {
    const texts = get().getItemTexts(index)
    get().items[index].texts = texts
  },

}))