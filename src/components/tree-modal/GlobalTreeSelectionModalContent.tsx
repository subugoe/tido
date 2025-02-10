import { FC } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'


interface SelectedItemIndicesType {
  collectionUrl: string,
  manifestIndex: number,
  itemIndex: number,
}

interface GlobalTreeSelectionModalContentProps {
  selectedItemIndices: SelectedItemIndicesType,
}

const GlobalTreeSelectionModalContent: FC<GlobalTreeSelectionModalContentProps> = ({ selectedItemIndices }) => {

  const panels = configStore(state => state.config.panels)
  const addNewPanel = configStore(state => state.addNewPanel)
  const updatePanel = configStore(state => state.updatePanel)

  const newPanelConfig = {
    entrypoint: {
      url: selectedItemIndices.collectionUrl,
      type: 'collection',
    },
    manifestIndex: selectedItemIndices.manifestIndex,
    itemIndex: selectedItemIndices.itemIndex
  }

  let buttonsUpdatePanel
  if (panels && panels?.length > 0) {
    buttonsUpdatePanel = panels?.map((_, i) => <button
      className="t-bg-slate-200 t-w-20 t-h-8 t-mr-1 t-rounded-md hover:t-bg-slate-300" key={i}
      onClick={() => updatePanel(
        newPanelConfig
        , i)}>Panel {i + 1}</button>)
  }


  return (
    <div
      className="t-flex t-items-center t-h-12 t-border-1 t-border-gray-300 t-px-4 t-py-2 t-shadow-md t-rounded-md ">
      <div className="buttons-update-panel t-flex">
        {buttonsUpdatePanel}
      </div>
      <button className="button-new-panel t-bg-slate-200 t-w-24 t-h-8 t-mr-1 t-rounded-md hover:t-bg-slate-300"
        onClick={() => addNewPanel(newPanelConfig)}> New
          Panel
      </button>
    </div>)
}

export default GlobalTreeSelectionModalContent
