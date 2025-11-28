import { FC } from 'react'
import { useTree } from '@/contexts/TreeContext'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'
import { getPanelConfigFromNode } from '@/utils/tree.ts'

interface GlobalTreeSelectionModalContentProps {
  node: TreeNode | null
  onSelect: () => void
}

const GlobalTreeSelectionModalContent: FC<GlobalTreeSelectionModalContentProps> = ({ node, onSelect }) => {

  const panels = usePanelStore(state => state.panels)
  const updatePanel = usePanelStore(state => state.updatePanel)
  const addPanel = usePanelStore(state => state.addPanel)

  const { setSelectedNodeId } = useTree()

  if (!node) return <div>'error'</div>

  const panelConfig = getPanelConfigFromNode(node)

  async function select(i?: number) {
    if (i !== undefined) {
      updatePanel(panels[i].id, { config: panelConfig })
    } else {
      const newPanelId = crypto.randomUUID()
      useUIStore.getState().updateNewestPanelId(newPanelId)

      addPanel(panelConfig, newPanelId)
    }

    onSelect()
    setSelectedNodeId('')
  }

  let buttonsUpdatePanel
  if (panels.length > 0) {
    buttonsUpdatePanel = panels.map((_, i) => <button
      className="bg-accent hover:bg-muted w-20 h-8 mr-1 rounded-md cursor-pointer" key={i} data-cy="button-update-panel"
      onClick={() => select(i)}>Panel {i + 1}</button>)
  }

  return <div className="flex items-center h-12">
    <div className="buttons-update-panel flex" data-cy="buttons-update-panel">
      {buttonsUpdatePanel}
    </div>
    <button
      className="button-new-panel bg-accent hover:bg-muted w-24 h-8 mr-1 rounded-md cursor-pointer" data-cy="button-new-panel"
      onClick={() => select()}
    >New Panel</button>
  </div>
}

export default GlobalTreeSelectionModalContent
