import { FC, ReactElement } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import { Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Button } from '@/components/ui/button.tsx'

interface ImageActions {
  icon: ReactElement
  id: string
  tooltip: string
}

const ImageActionButtons: FC = () => {
  const { theme } = useConfig()
  const { panelId } = usePanel()

  const actions: ImageActions[] = [
    {
      icon: <ZoomIn />,
      id: 'zoom-in-' + panelId,
      tooltip: 'Zoom In',
    },

    {
      icon: <ZoomOut />,
      id: 'zoom-out-' + panelId,
      tooltip: 'Zoom Out',
    },
    {
      icon: <Maximize />,
      id: 'full-screen-' + panelId,
      tooltip: 'Toggle full page',
    },
    {
      icon: <Minimize />,
      id: 'exit-full-screen-' + panelId,
      tooltip: 'Show base position of image',
    },
  ]

  const actionButtons =
    actions.length > 0 &&
    actions.map((action, i) => (
      <Button
        variant="ghost"
        size="icon"
        key={i}
        id={action.id}
        title={action.tooltip}
        className="rounded-full"
      >
        <div
          className="flex items-center justify-center"
          style={{ color: theme.primaryColor }}
        >
          {action.icon}
        </div>
      </Button>
    ))

  return (
    <div className="flex items-center justify-center image-action-buttons gap-2 my-1">
      {actionButtons}
    </div>
  )
}
export default ImageActionButtons
