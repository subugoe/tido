import { FC, useEffect } from 'react';

import CustomHTML from '@/components/CustomHTML';

interface TextViewOneProps {
    textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {


useEffect(() => {
    
}, [])


  return (
    <div className="">
        <div >
            <CustomHTML textHtml={textHtml} />
        </div>
      
    </div>
  );
};

export default TextViewOne;