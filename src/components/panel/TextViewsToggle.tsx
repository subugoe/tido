import { FC, MouseEvent, useEffect, useRef } from 'react';
import { icons } from '@/utils/icons'

import CustomHTML from '@/components/CustomHTML';

import { useConfig } from '@/contexts/ConfigContext';

interface TextViewsToggleProps {
}


const TextViewsToggle: FC <TextViewsToggleProps>= ({}) => {

    const { config, updateConfig} = useConfig()

    const ref = useRef(null)
  
    function handleTextViewClick(e:MouseEvent<HTMLButtonElement>, index: number) {
        e.preventDefault()
        let newConfig = {...config}

        newConfig.urlConfig.v = index
        updateConfig(newConfig)
    }
  const textViewsTitles = Object.keys(icons)
  
  useEffect(() => {
     
  }, [])



  const buttons =
  textViewsTitles.length > 0 &&
  textViewsTitles.map((title, i) => (
        <button
            className="t-p-1 t-rounded t-mr-3 t-w-8 t-h-8"
            key={i}
            onClick={(e) => handleTextViewClick(e, i)}
            style={{'backgroundColor':(config?.urlConfig.v === i) ? '#E5E7EB': 'transparent'}}>

            <CustomHTML textHtml={icons[title]} />

        </button>
    ));

  return (
    <div className="text-views-toggle t-flex t-row t-ml-[70%] t-mb-6 t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  );
};

export default TextViewsToggle;
