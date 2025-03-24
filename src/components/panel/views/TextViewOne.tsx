import { FC, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer.tsx'
import Preview from '@/components/panel/Preview.tsx'

import { usePanel } from '@/contexts/PanelContext'

interface TextViewOneProps {
  textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {

  const { panelState } = usePanel()
  const imageUrl = panelState?.item?.image?.id
  const [previewModeIndex, setModeIndex] = useState(0)


  const previewModes = [
    {
      type: 'image'
    },
    {
      type: 'text'
    }
  ]

  return (
    <div className="t-flex-1 t-overflow-hidden">
      {previewModeIndex === 0 ? <TextRenderer htmlString={textHtml} /> : <OpenSeaDragonViewer />}
      <div
        className={'t-z-20 t-absolute t-border-[2px] t-border-zinc-800 t-p-[1px] t-w-20 t-h-24 t-overflow-hidden t-bottom-12 t-right-12'}>
        <Preview modes={previewModes} modeIndex={previewModeIndex}  setModeIndex={setModeIndex} >
          <img src={imageUrl} alt={'image of Digitalisat'} />
          <div className={'t-bg-white hover:t-bg-gray-100 t-text-[5px]'}>
            <TextRenderer htmlString={textHtml} />
          </div>
        </Preview>
      </div>
    </div>
  )
}

export default TextViewOne
