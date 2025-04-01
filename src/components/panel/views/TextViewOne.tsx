import { FC, useState } from 'react'
import PreviewTextRenderer from '@/components/panel/PreviewTextRenderer.tsx'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer.tsx'
import Preview from '@/components/panel/Preview.tsx'
import { Image } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext'

interface TextViewOneProps {
  textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {

  const { panelState } = usePanel()
  const imageUrl = panelState?.item?.image?.id
  const [previewMode, setMode] = useState('A')


  return (
    <div className="t-flex-1 t-overflow-hidden">
      { previewMode === 'A' ? <TextRenderer htmlString={textHtml} /> : <OpenSeaDragonViewer />}
      <Preview
        previewA={imageUrl ? <img src={imageUrl} alt={'image of Digitalisat'} /> : <div className="t-text-gray-300"><Image size={64} /></div>}
        previewB={<PreviewTextRenderer htmlString={textHtml} />}
        mode={previewMode}
        setMode={setMode}
      />
    </div>
  )
}

export default TextViewOne
