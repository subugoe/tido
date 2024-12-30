import React,{useEffect, useState, useRef, FC} from 'react';
import OpenSeadragon from 'openseadragon';

import ImageActionButtons from '@/components/ImageActionButtons'

interface OpenSeaDragonViewerProps {
  imageUrl: string | undefined,
  primaryColor: string
}

const OpenSeaDragonViewer: FC<OpenSeaDragonViewerProps> = ({imageUrl, primaryColor}) => {
  const viewerRef = useRef(null);
  useEffect(() => {
    const viewer = OpenSeadragon({
      id: 'viewer',
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
      tileSources: {
        type: 'image',
        url: imageUrl
      },
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
      fullPageButton: 'full-screen',
      homeButton: 'exit-full-screen'
    });

    viewerRef.current = viewer;
    return () => {
      viewerRef.current.destroy();
    };
  }, []);
  return (
      <div>
          <ImageActionButtons primaryColor={primaryColor}/>
          <div id="viewer" style={{ width: '100%', height: '500px' }} />
      </div>
    )
};
export default OpenSeaDragonViewer;