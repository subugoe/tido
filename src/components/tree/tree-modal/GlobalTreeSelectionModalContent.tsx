import { FC } from 'react'
import { useTree } from '@/contexts/TreeContext'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'

interface SelectedItemIndicesType {
  collectionUrl: string
  manifestIndex: number
  itemIndex: number
}

interface GlobalTreeSelectionModalContentProps {
  selectedItemIndices: SelectedItemIndicesType
  onSelect: () => void
}

const GlobalTreeSelectionModalContent: FC<GlobalTreeSelectionModalContentProps> = ({ selectedItemIndices, onSelect }) => {

  const panels = usePanelStore(state => state.panels)
  const updatePanel = usePanelStore(state => state.updatePanel)
  const addPanel = usePanelStore(state => state.addPanel)
  const { setSelectedNodeId } = useTree()

  const newPanelConfig = {
    collection: selectedItemIndices.collectionUrl,
    manifestIndex: selectedItemIndices.manifestIndex,
    itemIndex: selectedItemIndices.itemIndex
  }

  function select(i?: number) {
    if (i !== undefined) {
      updatePanel(panels[i].id, { config: newPanelConfig })
    }
    else {
      addPanel(newPanelConfig)
      useUIStore.getState().updateShowSelectViewPopover(true)
    }
    onSelect()
    setSelectedNodeId('')
  }

  let buttonsUpdatePanel
  if (panels.length > 0) {
    buttonsUpdatePanel = panels.map((_, i) => <button
      className="bg-muted dark:bg-background w-20 h-8 mr-1 rounded-md hover:bg-secondary" key={i} data-cy="button-update-panel"
      onClick={() => select(i)}>Panel {i + 1}</button>)
  }

  return <div className="flex items-center h-12">
    <div className="buttons-update-panel flex" data-cy="buttons-update-panel">
      {buttonsUpdatePanel}
    </div>
    <button
      className="button-new-panel bg-muted dark:bg-background w-24 h-8 mr-1 rounded-md hover:bg-background/80" data-cy="button-new-panel"
      onClick={() => select()}
    >New Panel</button>
  </div>
}

export default GlobalTreeSelectionModalContent
