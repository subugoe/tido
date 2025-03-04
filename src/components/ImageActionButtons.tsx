import { FC } from 'react'
import { zoomIn, zoomOut, fullscreen, exitFullscreen } from '@/utils/icons'

import { usePanel } from '@/contexts/PanelContext'

import CustomHTML from '@/components/CustomHTML'
import { useConfigStore } from '@/store/ConfigStore.tsx'

interface ImageActions {
  icon: string
  id: string
  tooltip: string
}

const ImageActionButtons: FC = () => {
  const primaryColor = useConfigStore(state => state.config.colors?.primary)
  const { panelId } = usePanel()

  const actions: ImageActions[] = [
    {
      icon: zoomIn,
      id: 'zoom-in-' + panelId,
      tooltip: 'Zoom In',
    },

    {
      icon: zoomOut,
      id: 'zoom-out-' + panelId,
      tooltip: 'Zoom Out',
    },
    {
      icon: fullscreen,
      id: 'full-screen-' + panelId,
      tooltip: 'Toggle full page',
    },
    {
      icon: exitFullscreen,
      id: 'exit-full-screen-' + panelId,
      tooltip: 'Show base position of image',
    },
  ]

  const actionButtons =
    actions.length > 0 &&
    actions.map((action, i) => (
      <button
        className="t-p-2 t-rounded hover:t-rounded-full hover:t-bg-gray-100 t-mr-1 t-w-8 t-h-8"
        key={i}
        id={action.id}
        title={action.tooltip}
      >
        <div
          className="t-flex t-items-center t-justify-center"
          style={{ color: primaryColor }}
        >
          <CustomHTML
            textHtml={action.icon}
            width="100%"
            icon={{ type: 'icon', width: 4, height: 3 }}
          />
        </div>
      </button>
    ))

  return (
    <div className="t-flex t-items-center t-justify-center image-action-buttons t-mb-1">
      {actionButtons}
    </div>
  )
}
export default ImageActionButtons
