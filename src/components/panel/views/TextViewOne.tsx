import { FC, useState } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'
import ImageRenderer from '@/components/panel/ImageRenderer.tsx'
import Preview from '@/components/panel/Preview.tsx'

import { Button } from '@/components/ui/button.tsx'
import { Text, Image } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface TextViewOneProps {
  textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {

  const [previewMode, setMode] = useState('A')
  const { t } = useTranslation()
  const [aGroup, setAGroup] = useState(true)

  return (
    <div className="flex-1 h-full">
      <Button onClick={() => setAGroup(!aGroup)} className={'absolute z-50 top-0 left-0'}>Toggle Annotations</Button>
      { previewMode === 'A' ? <TextRenderer htmlString={textHtml} aGroup={aGroup} /> : <ImageRenderer />}
      <Preview
        previewA={
          <Button
            data-cy='preview-image'
            className="px-2 py-3 h-auto shadow-xl"
            variant="outline"
            color="secondary"
          >
            <div className="flex flex-col justify-center items-center">
              <Image className="size-8 mb-2" />
              <div>{t('show_image')}</div>
            </div>
          </Button>
        }
        previewB={
          <Button
            data-cy='preview-text'
            className="px-2 py-3 h-auto shadow-xl"
            variant="outline"
            color="secondary"
          >
            <div className="flex flex-col justify-center items-center">
              <Text className="size-8 mb-2" />
              <div>{t('show_text')}</div>
            </div>
          </Button>
        }
        mode={previewMode}
        setMode={setMode}
      />
    </div>
  )
}

export default TextViewOne
