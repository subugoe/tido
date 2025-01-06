import React,{ useEffect, useRef, FC } from 'react'
import OpenSeadragon from 'openseadragon'

import ImageActionButtons from '@/components/ImageActionButtons'

interface OpenSeaDragonViewerProps {
  imageUrl: string | undefined,
  primaryColor: string,
  panelId: string
}

const OpenSeaDragonViewer: FC<OpenSeaDragonViewerProps> = ({ imageUrl, primaryColor, panelId }) => {
  const viewerRef = useRef<OpenSeadragon.Viewer>()
  const viewerId = 'viewer-' + panelId

  useEffect(() => {
    const viewer = OpenSeadragon({
      id: viewerId,
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
      tileSources: {
        type: 'image',
        url: imageUrl
      },
      zoomInButton: 'zoom-in-' + panelId,
      zoomOutButton: 'zoom-out-' + panelId,
      fullPageButton: 'full-screen-' + panelId,
      homeButton: 'exit-full-screen-' + panelId
    })

    viewerRef.current = viewer

    return () => {
      viewerRef.current?.destroy()
    }
  }, [])
  return (
      <div>
          <ImageActionButtons primaryColor={primaryColor} panelId={panelId}/>
          <div id={viewerId} style={{ width: '100%', height: '500px' }} />
      </div>
    )
}
export default OpenSeaDragonViewer