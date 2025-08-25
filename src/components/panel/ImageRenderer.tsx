import  { useEffect, FC, useState, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import { Loader2 } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import ImageActionButtons from '@/components/panel/ImageActionButtons.tsx'
import { useErrorBoundary } from 'react-error-boundary'

const ImageRenderer: FC = () => {
  const { panelId, panelState, usePanelTranslation } = usePanel()
  const loadingPanelData = usePanel().loading
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()

  const imageViewerRef = useRef(null)
  const imageUrl = panelState?.item?.image?.id
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    if (loadingPanelData) return

    if (!imageUrl && !loadingPanelData) {
      showBoundary(t('could_not_find_image'))
      return
    }

    setLoading(true)

    const viewer = OpenSeadragon({
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
      showBoundary(t('could_not_load_image'))
    })

    viewer.addOnceHandler('open', () => {
      setLoading(false)
    })
    return () => {
      if (viewer) viewer.destroy()
    }
  }, [loadingPanelData, imageUrl, imageViewerRef.current])



  return (
    <>
      <div className="flex relative flex-col h-full w-full">
        <ImageActionButtons />
        {loading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>}
        <div ref={imageViewerRef} className="w-full h-full" />
      </div>
    </>
  )
}
export default ImageRenderer
