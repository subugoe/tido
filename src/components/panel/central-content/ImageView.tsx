import { FC } from 'react';
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer';

import { contentStore } from '@/store/ContentStore'

interface ImageViewProps {
  imageUrl: string | undefined,
  panelId: string
}

const ImageView: FC<ImageViewProps> = ({imageUrl, panelId}) => {

  const primaryColor = contentStore(state => state.openedPanels[panelId].primaryColor)

  return (
    <div className="">
        <div className="t-flex t-flex-col">
            <OpenSeaDragonViewer imageUrl= {imageUrl} primaryColor={primaryColor} panelId={panelId} />
        </div>
    </div>
  );
};

export default ImageView;