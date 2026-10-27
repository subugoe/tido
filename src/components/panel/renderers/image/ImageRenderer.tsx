import  { useEffect, FC, useState, useRef } from 'react'
import OpenSeadragon, { Viewer } from 'openseadragon'
import { usePanel } from '@/contexts/PanelContext.tsx'

import ImageActionButtons from '@/components/panel/views/image/ImageActionButtons.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import Loading from '@/components/ui/loading.tsx'

const ImageRenderer: FC = () => {
  const { panelId, panelState, usePanelTranslation, loading: loadingPanel } = usePanel()
  const { t } = usePanelTranslation()
  const { showBoundary } = useErrorBoundary()

  const viewerContainerRef = useRef(null)
  const viewerRef = useRef<Viewer>(null)
  const imageUrl = panelState?.item?.images?.[0]?.id
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!viewerContainerRef.current) return

    viewerRef.current = OpenSeadragon({
      element: viewerContainerRef.current,
      zoomInButton: 'zoom-in-' + panelId,
      zoomOutButton: 'zoom-out-' + panelId,
      fullPageButton: 'full-screen-' + panelId,
      homeButton: 'exit-full-screen-' + panelId,

      // relative to the "fit" zoom, so the image can always be fully contained regardless of container size
      minZoomImageRatio: 0.5,
      maxZoomLevel: 10,
      defaultZoomLevel: 0,
      visibilityRatio: 1.0,
      constrainDuringPan: true,
      // OSD's built-in auto resize scales the zoom by the container's diagonal change, which makes the image
      // overflow the container when only one dimension grows. We handle resizing ourselves below.
      autoResize: false
    })

    viewerRef.current.addHandler('open-failed', (e: { message: string }) => {
      console.error(e.message)
      showBoundary(t('could_not_load_image'))
    })

    viewerRef.current.addHandler('open', function () {
      setInitialZoom()
      setLoading(false)
    })

    const resize = new ResizeObserver(() => {
      const viewer = viewerRef.current
      if (!viewer) return
      const { container, viewport } = viewer
      const newSize = new OpenSeadragon.Point(container.clientWidth, container.clientHeight)
      if (newSize.x === 0 || newSize.y === 0 || newSize.equals(viewport.getContainerSize())) return

      // Keep the user's zoom relative to the "fit" zoom, so the image scales proportionally with the container
      const relativeZoom = viewport.getZoom(true) / viewport.getHomeZoom()
      const center = viewport.getCenter(true)

      // @types/openseadragon declares resize() without params, but OSD accepts (newContainerSize, maintain)
      const resizableViewport = viewport as unknown as { resize: (size: OpenSeadragon.Point, maintain: boolean) => void }
      resizableViewport.resize(newSize, true)
      viewport.zoomTo(viewport.getHomeZoom() * relativeZoom, undefined, true)
      viewport.panTo(center, true)
      viewport.applyConstraints(true)

      // Resizing clears the canvas. Draw synchronously (ResizeObserver runs before paint),
      // otherwise the browser paints an empty/stretched frame before OSD's next animation frame.
      // @types/openseadragon declares update() without params, but World accepts (viewportChanged)
      const world = viewer.world as unknown as { update: (viewportChanged: boolean) => boolean, draw: () => void }
      viewport.update()
      world.update(true)
      world.draw()
    })

    resize.observe(viewerContainerRef.current)

    return () => {
      resize.disconnect()
      if (viewerRef.current) viewerRef.current.destroy()
    }
  }, [])

  useEffect(() => {
    setLoading(true)

    if (loadingPanel) return

    if (panelState.item?.images && panelState.item.images.length === 0) {
      showBoundary(t('no_images_found'))
      return
    }

    if (!imageUrl || !viewerRef.current) {
      showBoundary(t('could_not_find_image'))
      return
    }

    const oldItem = viewerRef.current.world.getItemAt(0)
    if (oldItem) viewerRef.current.world.removeItem(oldItem)

    const imageType = panelState.item?.images?.[0] ? (panelState.item.images[0] as unknown as Record<string, unknown>)['x-type'] as string : undefined

    if (imageType === 'image' || !imageType) {
      viewerRef.current.open({
        type: 'image',
        url: imageUrl,
      })
    } else if (imageType === 'iiif') {
      viewerRef.current.open(imageUrl)
    }
  }, [panelState.item, loadingPanel])

  function setInitialZoom() {
    if (!viewerRef.current) return
    const { viewport } = viewerRef.current
    viewport.zoomTo(viewport.getHomeZoom() * 0.9, undefined, true)
    viewport.panTo(viewport.getHomeBounds().getCenter(), true)
  }


  return (
    <>
      <div className="flex relative flex-col h-full w-full">
        <ImageActionButtons />
        <div ref={viewerContainerRef} className="w-full h-full" />
      </div>
      {loading && <div className="absolute z-50 bg-background w-full h-full">
        <Loading />
      </div>}
    </>
  )
}
export default ImageRenderer
