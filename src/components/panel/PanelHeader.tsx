import { FC } from 'react'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'
import NavigationButton from '@/components/panel/NavigationButton.tsx'
import Modal from '@/components/Modal.tsx'
import Metadata from '@/components/metadata/Metadata'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const PanelHeader: FC = () => {
  return (
    <div className="panel-header t-flex t-flex-col t-mb-6">
      <div className="t-flex t-items-center t-mb-6">
        <CollectionTitle />

        <div className="t-ml-12 t-w-[250px] t-text-wrap t-break-words">
          <Modal TriggerButton={<Button variant={'outline'} size={'icon'}> {<Layers />} </Button>}>
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
