import { FC, useEffect, useState } from 'react'

import { TreeProvider } from '@/contexts/TreeContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { logError } from '@/utils/custom-error.ts'

import Tree from '@/components/tree/Tree.tsx'

import { createCollectionNode, getChildren, getExpandedNode, getPanelConfigFromNode } from '@/utils/tree.ts'

interface Props {
  collectionId: string,
  onSelect:() => void,
}

const LocalTree: FC<Props> = ( { collectionId, onSelect } ) => {
  const { panelId, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { tree: { showItemLevel } } = useConfig()
  const updatePanel = usePanelStore(state => state.updatePanel)
  const [treeNodes, setTreeNodes] = useState([])

  function onNodeSelect(node: TreeNode) {
    const config = getPanelConfigFromNode(node)
    updatePanel( panelId, { config })
    onSelect()
  }

  useEffect(() => {
    async function initTreeNode(collectionId: string) {
      const collectionNode = await createCollectionNode(collectionId)
      setTreeNodes([await getExpandedNode(collectionNode, showItemLevel)])
    }
    initTreeNode(collectionId).catch(e => logError(e, t))
  }, [])

  return <div className="flex flex-col">
    <div className="max-h-[60vh] overflow-y-auto pr-2">
      <TreeProvider onSelect={onNodeSelect} getChildren={(node) => getChildren(node, showItemLevel)}>
        <Tree nodes={treeNodes} />
      </TreeProvider>
    </div>
  </div>
}


export default LocalTree
