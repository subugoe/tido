import { create } from 'zustand'

interface PanelStates {
  [id: string]: PanelState
}

interface PanelStoreTypes {
  panels: PanelStates // or panels: each panel has one opened item
  activeTargetIndex: number
  initPanelState: (id: string, index: number) => void
  addPanelContent: (newPanel: PanelState) => void
  updatePanelState: (id: string, data: Partial<PanelState>) => void
  updatePanels: (panelId: string, updatedItem: PanelState) => void
  updateContentToggleIndex: (
    panelIndex: string,
    newContentIndex: number
  ) => void
  updateViewIndex: (panelId: string, newViewIndex: number) => void
  getPanelState: (panelId: string | null) => PanelState | null
  setActiveTargetIndex: (panelId: string, index: number) => void
  removePanel: (panelId: string) => void
}

function getDefaultPanelState(id: string, index: number): PanelState {
  return {
    id,
    index,
    collectionId: null,
    item: null,
    manifest: null,
    contentTypes: [],
    contentIndex: 0,
    viewIndex: 0,
    activeTargetIndex: -1
  }
}

export const usePanelStore = create<PanelStoreTypes>((set, get) => ({
  panels: {},
  activeTargetIndex: -1,
  initPanelState: (id: string, index: number) => {
    get().updatePanelState(id, getDefaultPanelState(id, index))
  },
  addPanelContent: (newPanel: PanelState) => {
    const newPanels = { ...get().panels }
    newPanels[newPanel.id] = newPanel
    set({ panels: newPanels })
  },

  updateContentToggleIndex: (panelId: string, newContentIndex: number) => {
    const panel = get().getPanelState(panelId)
    if (!panel) return // TODO: add error handling

    panel.contentIndex = newContentIndex
    get().updatePanels(panelId, panel)
  },
  updatePanelState(id: string, data: Partial<PanelState>) {
    set({
      panels: {
        ...get().panels,
        [id]: {
          ...get().panels[id],
          ...data
        }
      }
    })
  },
  updateViewIndex: (panelId: string, newViewIndex: number) => {
    const panel = get().getPanelState(panelId)
    if (!panel) return // TODO: add error handling

    panel.viewIndex = newViewIndex
    get().updatePanels(panelId, panel)
  },

  updatePanels: (panelId: string, updatedPanel: PanelState) => {
    const newPanels = { ...get().panels }
    newPanels[panelId] = updatedPanel
    set({ panels: newPanels })
  },

  getPanelState: (panelId: string | null) => {
    if (!panelId) return null
    if (!(panelId in get().panels)) return null
    return get().panels[panelId]
  },
  setActiveTargetIndex: (panelId: string, index: number) => {
    const panelState = get().panels[panelId]
    panelState.activeTargetIndex = index
    get().updatePanels(panelId, panelState)
  },
  removePanel: (panelId: string) => {
    const panels = get().panels
    const updatedPanels = Object
      .keys(panels)
      .filter(key => key !== panelId)
      .reduce((acc, cur) => {
        acc = {
          ...acc,
          [cur]: panels[cur]
        }
        return acc
      }, {} as PanelStates)

    set({ panels: updatedPanels })
  }
}))
