import { FC, useEffect } from 'react';

import CustomHTML from '@/components/CustomHTML';

interface TextViewOneProps {
    textHtml: string,
    widthText: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {


  return (
    <div className="">
        <div >
            <CustomHTML textHtml={textHtml} widthText='100%' />
        </div>
      
    </div>
  );
};

export default TextViewOne;