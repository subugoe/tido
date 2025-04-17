import { useEffect, FC } from 'react'
import OpenSeadragon from 'openseadragon'
import { Image } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import ImageActionButtons from '@/components/panel/ImageActionButtons.tsx'
import { useTranslation } from 'react-i18next'

const ImageRenderer: FC = () => {
  const { panelId, panelState } = usePanel()
  const { t } = useTranslation()

  const imageUrl = panelState?.item?.image?.id

  let viewer: OpenSeadragon.Viewer | null = null
  const viewerId = 'viewer-' + panelId

  useEffect(() => {
    if (!imageUrl) return
    viewer = OpenSeadragon({
      id: viewerId,
      prefixUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
      tileSources: {
        type: 'image',
        url: imageUrl,
      },
      zoomInButton: 'zoom-in-' + panelId,
      zoomOutButton: 'zoom-out-' + panelId,
      fullPageButton: 'full-screen-' + panelId,
      homeButton: 'exit-full-screen-' + panelId,
    })

    return () => {
      if (viewer) viewer.destroy()
    }
  }, [])
  return (
    <div className="t-flex t-w-full t-h-full">
      {imageUrl ?
        <div>
          <ImageActionButtons />
          <div id={viewerId} className="t-w-full t-h-full" />
        </div>
        : <div className="t-flex-1 t-flex t-flex-col t-items-center t-rounded-md t-bg-gray-100 t-p-3 t-m-3">
          <Image className="t-text-gray-300 t-mt-[36%]" size="60" />
          <span className="t-mt-4 t-font-semibold t-text-gray-600">{ t('no_image_available') }</span>
          <span className="t-mt-2 t-text-gray-600 t-text-center">{ t('could_not_find_image') }</span>
        </div>
      }
    </div>

  )
}
export default ImageRenderer
