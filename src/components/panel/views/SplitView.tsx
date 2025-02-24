import { FC } from 'react'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer'

import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface SplitViewProps {
  textHtml: string
}

const SplitView: FC<SplitViewProps> = ({ textHtml }) => {
  return (
    <div className="t-flex t-overflow-hidden">
      <div className="t-w-1/2 t-mr-3">
        <OpenSeaDragonViewer />
      </div>
      <div className="t-w-1/2">
        <TextRenderer htmlString={textHtml} />
      </div>
    </div>
  )
}

export default SplitView
