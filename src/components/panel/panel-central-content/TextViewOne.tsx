import { FC, useState, MouseEvent, useEffect } from 'react';

import { useConfig } from '@/contexts/ConfigContext'
import CustomHTML from '@/components/CustomHTML';
import BottomPlaceholder from '@/components/panel/panel-central-content/BottomPlaceholder';

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
            return <img src={config?.itemImageUrl} />
        }
        return  <span> click to show full text</span>
    }
    bottomElement = toggleContent()
}, [showText])


  return (
    <div className="">
        <div style={{display: showText? 'inline': 'none'}}>
            <CustomHTML textHtml={textHtml} widthText='100%'/>
        </div>
        <div style={{display: !showText? 'inline': 'none'}} >
            <img src={config?.itemImageUrl} className="t-h-96"/>
        </div>
        <div className="t-w-12 t-h-12 t-ml-[50%]">
          <button onClick={(e) => handleBottomElementClick(e)}> <img src={config?.itemImageUrl} style={{display: showText? 'inline': 'none'}}/> </button>
        </div>
        <div style={{display: !showText? 'inline': 'none'}} >
        <button onClick={(e) => handleBottomElementClick(e)}> Click to view full text </button>
        </div>
    </div>
  );
};

export default TextViewOne;
