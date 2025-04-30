import { useEffect, FC, useState, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import { Image } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import ImageActionButtons from '@/components/panel/ImageActionButtons.tsx'
import { useTranslation } from 'react-i18next'
import PanelContentWrapper from '@/components/panel/PanelContentWrapper.tsx'

const ImageRenderer: FC = () => {
  const { panelId, panelState } = usePanel()
  const { t } = useTranslation()
  const imageViewerRef = useRef(null)

  const [error, setError] = useState<string | null>(null)
  const imageUrl = panelState?.item?.image?.id

  let viewer: OpenSeadragon.Viewer | null = null

  useEffect(() => {
    if (!imageViewerRef.current) return

    if (!imageUrl) {
      setError(t('could_not_find_image'))
      return
    }

    viewer = OpenSeadragon({
      element: imageViewerRef.current,
      tileSources: {
        type: 'image',
        url: imageUrl,
      },
      zoomInButton: 'zoom-in-' + panelId,
      zoomOutButton: 'zoom-out-' + panelId,
      fullPageButton: 'full-screen-' + panelId,
      homeButton: 'exit-full-screen-' + panelId,
    })

    viewer.addHandler('open-failed', () => {
      setError(t('could_not_load_image'))
    })

    return () => {
      if (viewer) viewer.destroy()
    }
  }, [imageUrl, imageViewerRef])

  return (
    <>
      {error ?
        <PanelContentWrapper>
          <div className="t-flex-1 t-flex t-flex-col t-items-center t-rounded-md t-bg-gray-100 t-p-3">
            <Image className="t-text-gray-300 t-mt-[15vh]" size="60" />
            <span className="t-mt-4 t-font-semibold t-text-gray-600">{ t('no_image_available') }</span>
            <span className="t-mt-2 t-text-gray-600 t-text-center">{ error }</span>
          </div>
        </PanelContentWrapper>
        : <div className="t-flex t-flex-col t-h-full t-w-full">
          <ImageActionButtons />
          <div ref={imageViewerRef} className="t-w-full t-h-full" />
        </div>
      }
    </>
  )
}
export default ImageRenderer
