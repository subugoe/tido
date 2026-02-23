import  { useEffect, FC, useState, useRef } from 'react'
import OpenSeadragon from 'openseadragon'
import { usePanel } from '@/contexts/PanelContext.tsx'

import ImageActionButtons from '@/components/panel/ImageActionButtons.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import Loading from '@/components/ui/loading.tsx'

const ImageRenderer: FC = () => {
  const { panelId, panelState, usePanelTranslation, loading: loadingPanel } = usePanel()
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()

  const viewerContainerRef = useRef(null)
  const viewerRef = useRef(null)
  const imageUrl = panelState?.item?.image?.id
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (!viewerContainerRef.current) return

    viewerRef.current = OpenSeadragon({
      element: viewerContainerRef.current,
      zoomInButton: 'zoom-in-' + panelId,
      zoomOutButton: 'zoom-out-' + panelId,
      fullPageButton: 'full-screen-' + panelId,
      homeButton: 'exit-full-screen-' + panelId,

      minZoomLevel: 0.5,
      maxZoomLevel: 10,
      defaultZoomLevel: 0,
      visibilityRatio: 1.0,
      constrainDuringPan: true
    })

    viewerRef.current.addHandler('open-failed', (e) => {
      console.error(e.message)
      showBoundary(t('could_not_load_image'))
    })

    viewerRef.current.addHandler('open', function () {
      setLoading(false)
    })

    return () => {
      if (viewerRef.current) viewerRef.current.destroy()
    }
  }, [])


  useEffect(() => {
    setLoading(true)

    if (loadingPanel) return

    if (!imageUrl || !viewerRef.current) {
      showBoundary(t('could_not_find_image'))
      return
    }

    const oldItem = viewerRef.current.world.getItemAt(0)
    if (oldItem) viewerRef.current.world.removeItem(oldItem)

    const imageType = panelState.item?.image?.['x-type']

    if (imageType === 'image' || !imageType) {
      viewerRef.current.open({
        type: 'image',
        url: imageUrl
      })
    }
    else if (imageType === 'iiif') {
      viewerRef.current.open(imageUrl)
    }
  }, [panelState.item, loadingPanel])



  return (
    <>
      <div className="flex relative flex-col h-full w-full">
        <ImageActionButtons />
        <div ref={viewerContainerRef} className="w-full h-full" />
      </div>
      {loading && <div className="absolute z-50 bg-background w-full h-full">
        <Loading size={36} />
      </div>}
    </>
  )
}
export default ImageRenderer
