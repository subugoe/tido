import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
interface Props {
  className: string
}
const PanelTopBar: FC<Props> = ({ className }) => {
  const { panelId } = usePanel()
  const setActiveTargetIndex = usePanelStore(state => state.setActiveTargetIndex)
  const activeTargetIndex = usePanelStore(state => state.panels[panelId].activeTargetIndex)

  function onDown() {
    setActiveTargetIndex(panelId, activeTargetIndex + 1)
  }

  function onUp() {
    setActiveTargetIndex(panelId, activeTargetIndex - 1)
  }
  return (
    <div className={`t-flex t-bg-amber-200 t-rounded-b-md ${className}`}>
      <Button size="icon" variant="ghostAmber" onClick={onDown}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 4v16m0 0l6-6m-6 6l-6-6" />
        </svg>
      </Button>
      <Button size="icon" variant="ghostAmber" onClick={onUp}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 20V4m0 0l6 6m-6-6l-6 6" />
        </svg>
      </Button>
    </div>
  )
}

export default PanelTopBar
