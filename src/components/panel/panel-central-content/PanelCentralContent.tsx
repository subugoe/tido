import { FC, useEffect, useState } from 'react';

import { useConfig } from '@/contexts/ConfigContext'

import TextViewOne from '@/components/panel/panel-central-content/TextViewOne';
import TextView from '@/components/panel/panel-central-content/TextView'
import SplitView from '@/components/panel/panel-central-content/./SplitView';

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
  else if (textViewIndex === 1) {
    return <TextView textHtml = {textHtml} />
  }
  else if (textViewIndex === 2) {
    return <SplitView textHtml = {textHtml} />
  }


  return (
    <div className="">
      <span> Value of v {textViewIndex} </span>
    </div>
  );
};

export default PanelCentralContent;
