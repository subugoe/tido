import { FC } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface TextViewOneProps {
  textHtml: string
}

const TextView: FC<TextViewOneProps> = ({ textHtml }) => {
  return (
    <div className="h-full overflow-hidden">
      <TextRenderer htmlString={textHtml} />
    </div>
  )
}

export default TextView
