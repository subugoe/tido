import { FC } from 'react'
import { useTree } from '@/contexts/TreeContext'
import { usePanelStore } from '@/store/PanelStore.tsx'

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
    if (i !== undefined) updatePanel(panels[i].id, { config: newPanelConfig })
    else addPanel(newPanelConfig)
    onSelect()
    setSelectedNodeId('')
  }

  let buttonsUpdatePanel
  if (panels.length > 0) {
    buttonsUpdatePanel = panels.map((_, i) => <button
      className="t-bg-slate-200 t-w-20 t-h-8 t-mr-1 t-rounded-md hover:t-bg-slate-300" key={i} data-cy="button-update-panel"
      onClick={() => select(i)}>Panel {i + 1}</button>)
  }

  return <div className="t-flex t-items-center t-h-12">
    <div className="buttons-update-panel t-flex" data-cy="buttons-update-panel">
      {buttonsUpdatePanel}
    </div>
    <button
      className="button-new-panel t-bg-slate-200 t-w-24 t-h-8 t-mr-1 t-rounded-md hover:t-bg-slate-300" data-cy="button-new-panel"
      onClick={() => select()}
    >New Panel</button>
  </div>
}

export default GlobalTreeSelectionModalContent
