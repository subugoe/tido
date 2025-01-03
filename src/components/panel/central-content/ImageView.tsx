import { FC } from 'react';
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer';

import { contentStore } from '@/store/ContentStore'

interface ImageViewProps {
  imageUrl: string | undefined,
  panelIndex: number
}

const ImageView: FC<ImageViewProps> = ({imageUrl, panelIndex}) => {

  const primaryColor = contentStore(state => state.openedPanels[panelIndex].primaryColor)

  return (
    <div className="">
        <div className="t-flex t-flex-col">
            <OpenSeaDragonViewer imageUrl= {imageUrl} primaryColor={primaryColor} panelIndex={panelIndex} />
        </div>
    </div>
  );
};

export default ImageView;