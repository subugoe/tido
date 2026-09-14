import { FC, memo } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

const FullScreenToggle: FC = memo(() => {
  const { isFullscreen, enterFullscreen, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  function toggle() {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={toggle}
      data-cy="fullscreen-toggle"
    >
      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      {t(isFullscreen ? 'exit_fullscreen' : 'show_fullscreen')}
    </DropdownMenuItem>
  )
})

export default FullScreenToggle
