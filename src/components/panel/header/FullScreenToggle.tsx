import { FC, memo } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

const FullScreenToggle: FC = memo(() => {
  const { isFullscreen, enterFullscreen, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  function toggle() {
    if (isFullscreen)  {
      document.exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  return (
    <BaseTooltip message={t(isFullscreen ? 'exit_fullscreen' : 'show_fullscreen')}>
      <Button
        size="icon"
        variant="ghost"
        onClick={toggle}
        className=""
      >
        {isFullscreen ? <Minimize2 /> : <Maximize2 />}
      </Button>
    </BaseTooltip>
  )
})

export default FullScreenToggle
