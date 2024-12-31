import React,{useEffect, useState, useRef, FC} from 'react';
import OpenSeadragon from 'openseadragon';

import ImageActionButtons from '@/components/ImageActionButtons'

interface OpenSeaDragonViewerProps {
  imageUrl: string | undefined,
  primaryColor: string,
  panelIndex: number
}

const OpenSeaDragonViewer: FC<OpenSeaDragonViewerProps> = ({imageUrl, primaryColor, panelIndex}) => {
  const viewerRef = useRef(null);
  const viewerId = 'viewer-' + panelIndex
  useEffect(() => {
    const viewer = OpenSeadragon({
      id: viewerId,
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
      tileSources: {
        type: 'image',
        url: imageUrl
      },
      zoomInButton: 'zoom-in-' + panelIndex,
      zoomOutButton: 'zoom-out-' + panelIndex,
      fullPageButton: 'full-screen-' + panelIndex,
      homeButton: 'exit-full-screen-' + panelIndex
    });

    viewerRef.current = viewer;
    return () => {
      viewerRef.current.destroy();
    };
  }, []);
  return (
      <div>
          <ImageActionButtons primaryColor={primaryColor} panelIndex={panelIndex}/>
          <div id={viewerId} style={{ width: '100%', height: '500px' }} />
      </div>
    )
};
export default OpenSeaDragonViewer;