import { FC } from 'react'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'

const PanelHeader: FC = () => {
  return (
    <div className="panel-header t-flex t-flex-col t-mb-6">
      <div className="t-flex t-items-center t-mb-6">
        <CollectionTitle />
        <TextViewsToggle />
      </div>
      <div className="t-flex t-justify-center t-mb-4">
        <PanelTitle />
      </div>
      <div className="t-flex t-justify-center">
        <ContentTypesToggle />
      </div>
    </div>
  )
}

export default PanelHeader
