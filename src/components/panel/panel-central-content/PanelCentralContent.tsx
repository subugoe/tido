import { FC, useEffect, useState } from 'react';

import { useConfig } from '@/contexts/ConfigContext'

import TextViewOne from '@/components/panel/panel-central-content/TextViewOne';
import CustomHTML from '@/components/CustomHTML';

interface PanelCentralContentProps {
  textHtml: string,
}


const PanelCentralContent: FC<PanelCentralContentProps> = ({ textHtml }) => {
  // props: (text, textViewIndex)

  const {config} = useConfig()

  const [textViewIndex, setTextViewIndex] = useState(config?.urlConfig.v)

  useEffect(() => {
    setTextViewIndex(config?.urlConfig.v)
    
  }, [config])

  if (textViewIndex === 0) {
    return <TextViewOne textHtml = {textHtml}/>
  }

  return (
    <div className="">
      <span> Value of v {textViewIndex} </span>
    </div>
  );
};

export default PanelCentralContent;
