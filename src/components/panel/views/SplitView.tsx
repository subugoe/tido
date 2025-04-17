import { FC } from 'react'
import ImageRenderer from '@/components/panel/ImageRenderer.tsx'

import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface SplitViewProps {
  textHtml: string
}

const SplitView: FC<SplitViewProps> = ({ textHtml }) => {
  return (
    <div className="t-flex t-h-full t-overflow-hidden">
      <div className="t-w-1/2">
        <ImageRenderer />
      </div>
      <div className="t-w-1/2 t-border-l t-pl-3">
        <TextRenderer htmlString={textHtml} />
      </div>
    </div>
  )
}

export default SplitView
