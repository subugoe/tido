import { FC, useState } from 'react'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'
import NavigationButton from '@/components/panel/NavigationButton.tsx'
import Modal from '@/components/Modal.tsx'
import Metadata from '@/components/metadata/Metadata'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const PanelHeader: FC = () => {

  const [showMetadata, setShowMetadata] = useState(false)

  return (
    <div className="panel-header t-flex t-flex-col t-mb-6">
      <div className="t-flex t-items-center t-mb-6">
        <CollectionTitle />

        <div className="t-ml-4 t-w-[400px] t-text-wrap t-break-words">
          <Modal TriggerButton={<Button onClick={() => setShowMetadata(!showMetadata)} variant={showMetadata ? 'secondary' : 'ghost'} size={'icon'}>{<Info />} </Button>}
            onOpenChange={(isOpen) => setShowMetadata(isOpen)} showPopover={showMetadata} width={400} >
            <X className="t-absolute t-right-3 t-top-4 t-text-zinc-600 hover:t-text-zinc-700 hover:t-cursor-pointer"  size={15} onClick={() => setShowMetadata(false)} />
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
