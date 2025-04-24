import { FC, useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'
import NavigationButton from '@/components/panel/NavigationButton.tsx'
import Modal from '@/components/Modal.tsx'
import Metadata from '@/components/metadata/Metadata'

const PanelHeader: FC = () => {
  const [showMetadata, setShowMetadata] = useState(false)

  return (
    <div className="panel-header t-flex t-flex-col t-px-3 t-pt-3 t-pb-5">
      <div className="t-flex t-items-center t-mb-6">
        <CollectionTitle />

        <div className="t-ml-4 t-w-[400px] t-text-wrap t-break-words">
          <Modal
            TriggerButton={<Button onClick={() => setShowMetadata(!showMetadata)}
              variant={showMetadata ? 'secondary' : 'ghost'}
              size={'icon'}>{<Info />}
            </Button>}
            onOpenChange={(isOpen) => setShowMetadata(isOpen)} showPopover={showMetadata} width={400} >
            <Metadata />
          </Modal>
        </div>

        <TextViewsToggle />
      </div>
      <div className="t-flex t-justify-center t-mb-4">
        <NavigationButton isPrev={true} />
        {<PanelTitle />}
        <NavigationButton />
      </div>
      <div className="t-flex t-justify-center">
        {<ContentTypesToggle />}
      </div>
    </div>
  )
}

export default PanelHeader
