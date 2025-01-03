import { FC } from 'react';

import CustomHTML from '@/components/CustomHTML';

interface TextViewOneProps {
    textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {
  return (
        <div>
            <CustomHTML textHtml={textHtml} widthText='100' />
        </div>
  );
};

export default TextViewOne;