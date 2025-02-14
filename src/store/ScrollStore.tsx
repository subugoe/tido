import { create } from 'zustand'
import { setupScrollPanels } from '@/utils/annotations.ts'

interface ListenerItem {
  element: HTMLElement
  eventName: string
  listener: () => void
}
interface ListenersMap {
  [key: string]: ListenerItem[]
}
interface ScrollStoreType {
  panelIds: string[]
  listenersMap: ListenersMap
  update: (panelIds: string[]) => void
  registerListener: (panelId: string, item: ListenerItem) => void
}

export const scrollStore = create<ScrollStoreType>((set, get) => ({
  panelIds: [],
  listenersMap: {},
  update: (panelIds: string[]) => {
    set({ panelIds })

    const oldListenerMap = get().listenersMap

    Object.keys(oldListenerMap)
      .forEach(key => {
        const items = oldListenerMap[key]
        items.forEach(({ element, eventName, listener }) => {
          element.removeEventListener(eventName, listener)
        })
      })

    set({
      panelIds,
      listenersMap: {}
    })

    setupScrollPanels(panelIds)
  },
  registerListener: (panelId: string, item: ListenerItem) => {
    item.element.addEventListener(item.eventName, item.listener)

    const oldListenerMap = get().listenersMap
    set({
      listenersMap: {
        ...oldListenerMap,
        [panelId]: [...(oldListenerMap[panelId] ?? []), item]
      }
    })
  }
}))
