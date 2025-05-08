import { FC, ReactElement } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import { useConfigStore } from '@/store/ConfigStore.tsx'
import { Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageActions {
  icon: ReactElement
  id: string
  tooltip: string
}

const ImageActionButtons: FC = () => {
  const primaryColor = useConfigStore(state => state.config.theme.primaryColor)
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
      <button
        className="p-2 rounded hover:rounded-full hover:bg-gray-100 mr-1 w-8 h-8"
        key={i}
        id={action.id}
        title={action.tooltip}
      >
        <div
          className="flex items-center justify-center"
          style={{ color: primaryColor }}
        >
          {action.icon}
        </div>
      </button>
    ))

  return (
    <div className="flex items-center justify-center image-action-buttons mb-1">
      {actionButtons}
    </div>
  )
}
export default ImageActionButtons
