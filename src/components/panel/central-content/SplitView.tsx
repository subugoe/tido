import { FC } from 'react';
import { contentStore } from '@/store/ContentStore'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer';

import CustomHTML from '@/components/CustomHTML';

interface SplitViewProps {
    textHtml: string,
    imageUrl: string | undefined,
    panelIndex: number
}

const SplitView: FC<SplitViewProps> = ({ textHtml, imageUrl, panelIndex }) => {
  
  const primaryColor = contentStore(state => state.openedPanels[panelIndex].primaryColor)
  const widthText = '50' // in percentage

  return (
        <div className="t-flex">
             <div className="t-w-1/2 t-mr-3">
                <OpenSeaDragonViewer imageUrl= {imageUrl} primaryColor={primaryColor} panelIndex={panelIndex} />
             </div>
            <CustomHTML textHtml={textHtml} width={widthText} elementType='text' />
        </div>
     );
};

export default SplitView;