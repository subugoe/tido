import { FC } from 'react'
import { useConfigStore } from '@/store/ConfigStore.tsx'


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

  const panels = useConfigStore(state => state.config.panels)
  const addNewPanel = useConfigStore(state => state.addNewPanel)
  const updatePanel = useConfigStore(state => state.updatePanel)

  const newPanelConfig = {
    entrypoint: {
      url: selectedItemIndices.collectionUrl,
      type: 'collection',
    },
    manifestIndex: selectedItemIndices.manifestIndex,
    itemIndex: selectedItemIndices.itemIndex
  }

  function select(i?: number) {
    if (i !== undefined) updatePanel(newPanelConfig, i)
    else addNewPanel(newPanelConfig)
    onSelect()
  }

  let buttonsUpdatePanel
  if (panels && panels?.length > 0) {
    buttonsUpdatePanel = panels?.map((_, i) => <button
      className="t-bg-slate-200 t-w-20 t-h-8 t-mr-1 t-rounded-md hover:t-bg-slate-300" key={i}
      onClick={() => select(i)}>Panel {i + 1}</button>)
  }

  return <div className="t-flex t-items-center t-h-12">
    <div className="buttons-update-panel t-flex">
      {buttonsUpdatePanel}
    </div>
    <button
      className="button-new-panel t-bg-slate-200 t-w-24 t-h-8 t-mr-1 t-rounded-md hover:t-bg-slate-300"
      onClick={() => select()}
    >New Panel</button>
  </div>
}

export default GlobalTreeSelectionModalContent
