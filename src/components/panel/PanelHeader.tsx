import { FC, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

import TextViewsToggle from '@/components/panel/TextViewsToggle'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'
import NavigationButton from '@/components/panel/NavigationButton.tsx'
import Metadata from '@/components/metadata/Metadata'

const PanelHeader: FC = () => {
  const [showMetadataModal, setShowMetadataModal] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setShowMetadataModal(open)
  }

  return (
    <div className="panel-header t-flex t-flex-col t-px-3 t-pt-3 t-pb-5">
      <div className="t-flex t-items-center t-mb-6">
        <CollectionTitle />

        <div className="t-ml-1 t-w-[400px] t-text-wrap t-break-words">
          <Popover open={showMetadataModal} onOpenChange={handleOpenChange} modal={true}>
            <PopoverTrigger asChild>
              <Button onClick={() => setShowMetadataModal(!showMetadataModal)}
                variant={showMetadataModal ? 'secondary' : 'ghost'}
                size={'icon'}>{<Info />}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start"  sideOffset={8} className="t-w-[400px] t-pr-0" >
              <Metadata />
              <X className="t-absolute t-right-3 t-top-4 t-text-zinc-600 hover:t-text-zinc-700 hover:t-cursor-pointer"  size={15} onClick={() => setShowMetadataModal(false)} />
            </PopoverContent>
          </Popover>
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
