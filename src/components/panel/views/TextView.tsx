import { FC } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface TextViewOneProps {
  textHtml: string
}

const TextView: FC<TextViewOneProps> = ({ textHtml }) => {
  return (
    <div>
      <TextRenderer htmlString={textHtml} />
    </div>
  )
}

export default TextView
