import { FC, useState, MouseEvent, useEffect } from 'react';

import { useConfig } from '@/contexts/ConfigContext'
import CustomHTML from '@/components/CustomHTML';

interface TextViewOneProps {
    textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {

const { config } = useConfig()

const [showText, setShowText] = useState(true)

function handleBottomElementClick(e:MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setShowText(!showText)
}
  
//const imageContainer = <button className="t-w-12 t-h-12 t-ml-[50%]"> <img src={config?.itemImageUrl} /> </button>
let bottomElement;
useEffect(() => {
    function toggleContent() {
        if (showText) {
            return <img  />
        }
        return  <span> click to show full text</span>
    }
    bottomElement = toggleContent()
}, [showText])


  return (
    <div className="">
        <div style={{display: showText? 'inline': 'none'}}>
            <CustomHTML textHtml={textHtml} />
        </div>
       
    </div>
  );
};

export default TextViewOne;