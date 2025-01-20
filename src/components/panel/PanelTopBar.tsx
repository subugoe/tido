import { FC } from 'react'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import CustomHTML from '@/components/CustomHTML'
import { tree } from '@/utils/icons'

const PanelTopBar: FC = () => {
  return (
    <div className="panel-top-bar t-mb-6 t-flex">
      <TextViewsToggle />
    </div>
  )
}

export default PanelTopBar
