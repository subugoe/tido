import { FC, useEffect, useState } from 'react'

import { TreeProvider } from '@/contexts/TreeContext.tsx'

import Tree from '@/components/tree/Tree.tsx'

import { createCollectionNode, getChildren, getSelectedItemIndices } from '@/utils/tree.ts'
import { useTranslation } from 'react-i18next'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  collectionId: string
}

const LocalTree: FC<Props> = ( { collectionId } ) => {
  const { t } = useTranslation()
  const { panelId } = usePanel()
  const updatePanel = usePanelStore(state => state.updatePanel)
  const [treeNodes, setTreeNodes] = useState([])


  function onSelect(node: TreeNode) {
    const { collectionUrl, manifestIndex, itemIndex } = getSelectedItemIndices(node)

    updatePanel( panelId, { config: {
      collection: collectionUrl,
      manifestIndex: manifestIndex,
      itemIndex: itemIndex
    } })
  }

  useEffect(() => {
    async function initTreeNode(collectionId) {
      const collectionNode = await createCollectionNode(collectionId)
      setTreeNodes([collectionNode])
    }
    initTreeNode(collectionId)
  }, [])



  return <div className="flex flex-col">
    <div className="max-h-80 overflow-y-auto">
      <TreeProvider onSelect={onSelect} getChildren={getChildren}>
        <Tree nodes={treeNodes} />
      </TreeProvider>
    </div>
  </div>
}


export default LocalTree
