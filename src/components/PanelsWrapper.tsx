import { FC, useEffect, useLayoutEffect, useRef } from 'react'
import AddPanel from '@/components/AddPanel.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import Panel from '@/components/panel/Panel.tsx'
import { getInitialPanelWidths } from '@/utils/panel-resizer.ts'

interface Props {
  onPanelsLoaded?: () => void
}

const PanelsWrapper: FC<Props> = ({ onPanelsLoaded }) => {
  const { panels: panelsConfig, showPanelPlaceholder } = useConfig()
  const panels = usePanelStore(state => state.panels)
  const initializePanels = usePanelStore.getState().initializePanels

  const wrapperRef = useRef<HTMLDivElement>(null)

  const numberPanelsLoadedRef = useRef(0)

  useEffect(() => {
    initializePanels(panelsConfig)
  }, [panelsConfig])

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // The panels that exist at the start are laid out with the most possible width, computed
    // from the room the wrapper leaves for them. Panels opened later keep the default width.
    const widths = getInitialPanelWidths(wrapper, panelsConfig)
    const panelEls = wrapper.querySelectorAll('.panel')
    panelEls.forEach((el, index) => {
      const width = widths[index]
      if (width !== undefined) {
        (el as HTMLElement).dataset.initialWidth = String(width)
      }
    })
  }, [panels, panelsConfig])

  function incrementPanelLoaded() {
    numberPanelsLoadedRef.current += 1
    if (numberPanelsLoadedRef.current === panels.length && onPanelsLoaded) {
      onPanelsLoaded()
    }
  }


  return <div id="panels-wrapper" ref={wrapperRef} className="flex-1 flex h-full space-x-4 overflow-x-auto pr-2 py-4 px-6 rounded-2xl" data-cy="panels-wrapper">
    { panels.map((state) => <Panel state={state} key={state.id} onPanelLoaded={incrementPanelLoaded}  />) }
    { showPanelPlaceholder && <AddPanel /> }
  </div>
}

export default PanelsWrapper
