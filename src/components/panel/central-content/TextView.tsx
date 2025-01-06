import { FC } from 'react';

import CustomHTML from '@/components/CustomHTML';

interface TextViewOneProps {
    textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {

  return (
        <div>
            <CustomHTML textHtml={textHtml} width='100%' />
        </div>
   );
};

export default TextViewOne;