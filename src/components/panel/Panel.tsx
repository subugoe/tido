import { FC, useState } from 'react'

import { PanelProvider } from '@/contexts/PanelContext'

import ContentTypesToggle from '@/components/panel/ContentTypesToggle'
import PanelCentralContent from '@/components/panel/views/PanelCentralContent'
import PanelTopBar from '@/components/panel/PanelTopBar'

import ErrorComponent from '@/components/ErrorComponent'

interface PanelProps {
  panelId: string
}

const Panel: FC<PanelProps> = ({ panelId }) => {
  // TODO: one should get a potential error regarding this panel from probably panels wrapper or a global state of error
  //        and display the respective error component
  const [error] = useState<boolean | string>(false)

  if (error) {
    return <ErrorComponent message={error} />
  }

  return (
    <PanelProvider id={panelId}>
      <div className="panel t-flex t-flex-col t-w-[600px] t-mr-6 t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-4 t-px-2.5 t-pt-8 t-pb-6">
        <PanelTopBar />
        <div className="t-flex t-flex-col t-items-center t-mb-6">
          <ContentTypesToggle />
        </div>
        <PanelCentralContent />
      </div>
    </PanelProvider>
  )
}

export default Panel
