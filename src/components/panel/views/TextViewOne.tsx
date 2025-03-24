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
  const [textShown, setTextShown] = useState(true)

  const previewStyles = 't-z-20 t-absolute t-border-[2px] t-border-zinc-800 t-p-[1px] t-w-20 t-h-24 t-overflow-hidden t-bottom-12 t-right-12'
  const additionalTextPreviewStyles = 't-bg-white hover:t-bg-gray-100 t-text-xs'

  return (
    <div className="t-flex-1 t-overflow-hidden">
      {textShown ? <TextRenderer htmlString={textHtml} /> : <OpenSeaDragonViewer />}
      <Preview textEl={<TextRenderer htmlString={textHtml} />} textShown={textShown} setTextShown={setTextShown} imageUrl={imageUrl} imageDescription={'Digitalisat'} previewStyles={previewStyles} additionalTextPreviewStyles={additionalTextPreviewStyles} />
    </div>
  )
}

export default TextViewOne
