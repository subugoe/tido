import { useEffect, FC } from 'react'
import OpenSeadragon from 'openseadragon'

import { usePanel } from '@/contexts/PanelContext'

import { panelStore } from '@/store/PanelStore.tsx'

import ImageActionButtons from '@/components/ImageActionButtons'

const OpenSeaDragonViewer: FC = () => {
  const { panelId } = usePanel()

  const imageUrl = panelStore((state) => state.panels[panelId].item.image?.id)

  let viewer: OpenSeadragon.Viewer | null = null
  const viewerId = 'viewer-' + panelId

  useEffect(() => {
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
    <div>
      <ImageActionButtons />
      <div id={viewerId} style={{ width: '100%', height: '500px' }} />
    </div>
  )
}
export default OpenSeaDragonViewer
