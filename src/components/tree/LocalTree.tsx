import { FC, useEffect, useState } from 'react'

import { TreeProvider } from '@/contexts/TreeContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

import Tree from '@/components/tree/Tree.tsx'

import { createCollectionNode, getChildren, getExpandedNode, getSelectedItemIndices } from '@/utils/tree.ts'

interface Props {
  collectionId: string,
  onSelect:() => void,
}

const LocalTree: FC<Props> = ( { collectionId, onSelect } ) => {
  const { panelId } = usePanel()
  const updatePanel = usePanelStore(state => state.updatePanel)
  const [treeNodes, setTreeNodes] = useState([])


  function onNodeSelect(node: TreeNode) {
    const { collectionUrl, manifestIndex, itemIndex } = getSelectedItemIndices(node)

    updatePanel( panelId, { config: {
      collection: collectionUrl,
      manifestIndex: manifestIndex,
      itemIndex: itemIndex
    } })

    onSelect()
  }

  useEffect(() => {
    async function initTreeNode(collectionId) {
      const collectionNode = await createCollectionNode(collectionId)
      setTreeNodes([await getExpandedNode(collectionNode)])
    }
    initTreeNode(collectionId)
  }, [])



  return <div className="flex flex-col">
    <div className="max-h-[60vh] overflow-y-auto">
      <TreeProvider onSelect={onNodeSelect} getChildren={getChildren}>
        <Tree nodes={treeNodes} />
      </TreeProvider>
    </div>
  </div>
}


export default LocalTree
