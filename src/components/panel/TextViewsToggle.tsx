import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { icons } from '@/utils/icons'
import CustomHTML from '@/components/CustomHTML';

import { contentStore } from '@/store/ContentStore'

interface TextViewsToggleProps {
    panelIndex: number
}

const TextViewsToggle: FC <TextViewsToggleProps>= ({panelIndex}) => {

    const textViewIndex = contentStore(state => state.openedPanels[panelIndex].v)
    const updateTextViewIndex = contentStore(state => state.updateTextViewIndex)


    const ref = useRef(null)
  
    function handleTextViewClick(e:MouseEvent<HTMLButtonElement>, index: number) {
        e.preventDefault()
        updateTextViewIndex(panelIndex, index)
    }

  const textViewsTitles = Object.keys(icons)
  

  const buttons =
  textViewsTitles.length > 0 &&
  textViewsTitles.map((title, i) => (
        <button
            className="t-p-1 t-rounded t-mr-3 t-w-8 t-h-8"
            key={i}
            onClick={(e) => handleTextViewClick(e, i)}
            style={{'backgroundColor':(textViewIndex === i) ? '#E5E7EB': 'transparent'}}>

            <CustomHTML textHtml={icons[title]} widthText='100%' />

        </button>
    ));

  return (
    <div className="text-views-toggle t-flex t-row t-ml-[70%] t-mb-6 t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  );
};

export default TextViewsToggle;