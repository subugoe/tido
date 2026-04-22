import { FC, useEffect, useRef } from 'react'
import AddPanel from '@/components/AddPanel.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import Panel from '@/components/panel/Panel.tsx'

interface Props {
  onPanelsLoaded?: () => void
}

const PanelsWrapper: FC<Props> = ({ onPanelsLoaded }) => {
  const { panels: panelsConfig, showPanelPlaceholder } = useConfig()
  const panels = usePanelStore(state => state.panels)
  const initializePanels = usePanelStore.getState().initializePanels


  const numberPanelsLoadedRef = useRef(0)

  useEffect(() => {
    initializePanels(panelsConfig)
  }, [panelsConfig])

  function incrementPanelLoaded() {
    numberPanelsLoadedRef.current += 1
    if (numberPanelsLoadedRef.current === panels.length && onPanelsLoaded) {
      onPanelsLoaded()
    }
  }


  return <div id="panels-wrapper" className="bg-background flex-1 flex h-full py-4 space-x-4 overflow-x-auto pr-2" data-cy="panels-wrapper">
    { panels.map((state) => <Panel state={state} key={state.id} onPanelLoaded={incrementPanelLoaded}  />) }
    { showPanelPlaceholder && <AddPanel /> }
  </div>
}

export default PanelsWrapper
