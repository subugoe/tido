import { FC, useEffect } from 'react';
import { useConfig } from '@/contexts/ConfigContext'

import CustomHTML from '@/components/CustomHTML';

interface SplitViewProps {
    textHtml: string,
    imageUrl: string | undefined
}

const SplitView: FC<SplitViewProps> = ({ textHtml, imageUrl }) => {
    
  const widthText = '50' // in percentage

  return (
    <div className="">
        <div className="t-flex">
             <div className="t-w-1/2 t-mr-3">
                 <img className="" src={imageUrl} />
             </div>
            <CustomHTML textHtml={textHtml} widthText={widthText} />
           

        </div>
      
    </div>
  );
};

export default SplitView;