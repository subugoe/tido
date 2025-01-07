import { FC } from 'react'
import { contentStore } from '@/store/ContentStore'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer'

import CustomHTML from '@/components/CustomHTML'

interface SplitViewProps {
  textHtml: string
  imageUrl: string | undefined
  panelId: string
}

const SplitView: FC<SplitViewProps> = ({ textHtml, imageUrl, panelId }) => {
  const primaryColor = contentStore(
    (state) => state.openedPanels[panelId].primaryColor
  )
  const widthText = '50' // in percentage

  return (
    <div className="t-flex">
      <div className="t-w-1/2 t-mr-3">
        <OpenSeaDragonViewer
          imageUrl={imageUrl}
          primaryColor={primaryColor}
          panelId={panelId}
        />
      </div>
      <CustomHTML textHtml={textHtml} width={widthText} />
    </div>
  )
}

export default SplitView
