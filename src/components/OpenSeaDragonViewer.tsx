import { useEffect, useRef, FC } from 'react'
import OpenSeadragon from 'openseadragon'

import { usePanel } from '@/contexts/PanelContext'

import { panelStore } from '@/store/PanelStore.tsx'

import ImageActionButtons from '@/components/ImageActionButtons'

const OpenSeaDragonViewer: FC = () => {
  const { panelId } = usePanel()

  const imageUrl = panelStore((state) => state.panels[panelId].item.image?.id)

  const viewerRef = useRef<OpenSeadragon.Viewer>()
  const viewerId = 'viewer-' + panelId

  useEffect(() => {
    const viewer = OpenSeadragon({
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

    viewerRef.current = viewer

    return () => {
      viewerRef.current?.destroy()
    }
  }, [])
  return (
    <div>
      <ImageActionButtons />
      <div id={viewerId} style={{ width: '100%', height: '500px' }} />
    </div>
  )
}
export default OpenSeaDragonViewer
