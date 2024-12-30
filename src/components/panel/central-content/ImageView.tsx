import { FC, useEffect } from 'react';
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer';

import { contentStore } from '@/store/ContentStore'

interface ImageViewProps {
  imageUrl: string | undefined,
  panelIndex: number
}

const ImageView: FC<ImageViewProps> = ({imageUrl, panelIndex}) => {

  const primaryColor = contentStore(state => state.openedPanels[panelIndex].primaryColor)

  useEffect (() => {
    // Decide: should error handling regarding imageUrl be checked here ?
  }, [imageUrl])

  return (
    <div className="">
        <div className="t-flex t-flex-col">
            <OpenSeaDragonViewer imageUrl= {imageUrl} primaryColor={primaryColor} />
        </div>
      
    </div>
  );
};

export default ImageView;