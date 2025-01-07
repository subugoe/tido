import { FC } from 'react'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer'

import CustomHTML from '@/components/CustomHTML'

interface SplitViewProps {
  textHtml: string
}

const SplitView: FC<SplitViewProps> = ({ textHtml }) => {
  const widthText = '50' // in percentage

  return (
    <div className="t-flex">
      <div className="t-w-1/2 t-mr-3">
        <OpenSeaDragonViewer />
      </div>
      <CustomHTML textHtml={textHtml} width={widthText} />
    </div>
  )
}

export default SplitView
