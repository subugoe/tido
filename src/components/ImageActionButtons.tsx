import { FC } from 'react'
import { zoomIn, zoomOut, fullscreen, exitFullscreen } from '@/utils/icons'
import CustomHTML from '@/components/CustomHTML'



interface ImageActionButtons {
    primaryColor:  string,
    panelIndex: number
}

const ImageActionButtons: FC<ImageActionButtons> = ({primaryColor, panelIndex}) => {
    
const actions = [
    {
        icon: zoomIn,
        id: 'zoom-in-' + panelIndex,
        tooltip: 'Zoom In'
    },

    {
        icon: zoomOut,
        id: 'zoom-out-' + panelIndex,
        tooltip: 'Zoom Out'
    },
    {
        icon: fullscreen,
        id: 'full-screen-' + panelIndex,
        tooltip: 'Toggle full page'
    },
    {
        icon: exitFullscreen,
        id: 'exit-full-screen-' + panelIndex,
        tooltip: 'Show base position of image'
    }
]

const actionButtons =
actions.length > 0 &&
actions.map((action, i) => (
          <button
              className="t-p-2 t-rounded hover:t-rounded-full hover:t-bg-gray-100 t-mr-1 t-w-8 t-h-8"
              key={i}
              id = {action.id}
              title={action.tooltip}
              >
              <div className="t-flex t-items-center t-justify-center" style={{color: primaryColor}}>
                <CustomHTML textHtml={action.icon} width='100%' />
              </div>
  
          </button>
      ));

  return (
    <div className="t-flex t-items-center t-justify-center image-action-buttons t-mb-1">
        {actionButtons}
    </div>
  )
}
export default ImageActionButtons
