import { FC } from 'react'
import ImageRenderer from '@/components/panel/ImageRenderer.tsx'

import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface SplitViewProps {
  textHtml: string
}

const SplitView: FC<SplitViewProps> = ({ textHtml }) => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-1/2">
        <ImageRenderer />
      </div>
      <div className="w-1/2 border-l pl-3">
        <TextRenderer htmlString={textHtml} />
      </div>
    </div>
  )
}

export default SplitView
