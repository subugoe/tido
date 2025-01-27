import { getItemIndices } from '@/utils/tree'
import { create } from 'zustand'



interface ConfigStoreType {
  config: Config,
  addCustomConfig: (customConfig: Config) => void,
  addNewPanel: (node: TreeNode, nodes: TreeNode[]) => void,

}

export const configStore = create<ConfigStoreType>((set, get) => ({

  config: {},
  addCustomConfig: (customConfig: Config) => {
    set({ config: customConfig })
  },
  addNewPanel: (node: TreeNode, nodes: TreeNode[]) => {

    const { id, type } = node

    console.log('node', node)

    let newPanelConfig

    if (type === 'collection') newPanelConfig = {
      entrypoint: {
        url: id,
        type: "collection",
      }
    }


    else if (type === 'item') {

      const { collectionIndex, manifestIndex, itemIndex } = getItemIndices(node, treeNodes)
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

  }
}))
