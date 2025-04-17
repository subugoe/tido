import { FC, useState } from 'react'
import PreviewTextRenderer from '@/components/panel/PreviewTextRenderer.tsx'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import ImageRenderer from '@/components/panel/ImageRenderer.tsx'
import Preview from '@/components/panel/Preview.tsx'
import { Image } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext'
import { useTranslation } from 'react-i18next'

interface TextViewOneProps {
  textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {

  const { t } = useTranslation()
  const { panelState } = usePanel()
  const imageUrl = panelState?.item?.image?.id
  const [previewMode, setMode] = useState('A')


  return (
    <div className="t-flex-1 t-h-full t-overflow-hidden t-pl-3">
      { previewMode === 'A' ? <TextRenderer htmlString={textHtml} /> : <ImageRenderer />}
      <Preview
        previewA={
          imageUrl
            ? <img src={imageUrl} alt={t('image_preview')} />
            : <div className="t-text-gray-300"><Image size={64} /></div>
        }
        previewB={<PreviewTextRenderer htmlString={textHtml} />}
        mode={previewMode}
        setMode={setMode}
      />
    </div>
  )
}

export default TextViewOne
