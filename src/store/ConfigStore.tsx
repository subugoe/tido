import { create } from 'zustand'



interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (newEntrypoint: string, type: string, nodes: TreeNode[]) => void,

}

export const configStore = create<ConfigStoreType>((set, get) => ({

  config: {},
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
  },
  addNewPanel: (newEntrypoint: string, type: string, nodes: TreeNode[]) => {

    /*
    const nodeIndices = getNodeIndices(newEntrypoint, nodes)
    let newPanelConfig

    if (type === 'collection') newPanelConfig = {
      entrypoint: {
        url: newEntrypoint,
        type: "collection",
      }
    }


    if (type === 'item') {
      const { collectionIndex, manifestIndex, itemIndex } = nodeIndices
      const collectionUrl = nodes[collectionIndex].id
      newPanelConfig =
      {
        entrypoint: {
          url: collectionUrl,
          type: "collection",
        },
        manifestIndex: manifestIndex,
        itemIndex: itemIndex
      }

    }

    let newConfig = { ...get().config }
    if (newPanelConfig) newConfig.panels?.push(newPanelConfig)

    set({ config: newConfig })
    */
  }
}))
