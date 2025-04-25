import { FC } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface TextViewOneProps {
  textHtml: string
}

const TextView: FC<TextViewOneProps> = ({ textHtml }) => {
  return (
    <div className="t-h-full t-overflow-hidden">
      <TextRenderer htmlString={textHtml} />
    </div>
  )
}

export default TextView
