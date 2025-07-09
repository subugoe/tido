import { FC } from 'react'
import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface TextViewOneProps {
  textHtml: string
}

const TextView: FC<TextViewOneProps> = ({ textHtml }) => {
  return (
    <TextRenderer htmlString={textHtml} />
  )
}

export default TextView
