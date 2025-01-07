import { FC } from 'react'
import OpenSeaDragonViewer from '@/components/OpenSeaDragonViewer'

const ImageView: FC = () => {
  return (
    <div className="">
      <div className="t-flex t-flex-col">
        <OpenSeaDragonViewer />
      </div>
    </div>
  )
}

export default ImageView
