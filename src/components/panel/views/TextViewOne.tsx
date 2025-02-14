import { FC } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface TextViewOneProps {
  textHtml: string
}

const TextViewOne: FC<TextViewOneProps> = ({ textHtml }) => {
  return (
    <div className="t-flex-1 t-overflow-hidden">
      <TextRenderer htmlString={textHtml} />
    </div>
  )
}

export default TextViewOne
