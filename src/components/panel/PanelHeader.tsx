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
import Actions from '@/components/panel/Actions.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

const PanelHeader: FC = () => {
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const { panelState } = usePanel()

  const handleOpenChange = (open: boolean) => {
    setShowMetadataModal(open)
  }

  return (
    <div className="panel-header flex flex-col px-3 pt-3 pb-5">
      <div className="flex items-center mb-6">
        <CollectionTitle />

        <div className="ml-1 text-wrap break-words">
          <Popover open={showMetadataModal} onOpenChange={handleOpenChange} modal={true}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => setShowMetadataModal(!showMetadataModal)}
                variant={showMetadataModal ? 'secondary' : 'ghost'}
                size={'icon'}
                disabled={!panelState?.contentTypes?.length}
              >
                {<Info />}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start"  sideOffset={8} className="w-[400px] pr-0">
              <Metadata />
              <X className="absolute right-3 top-4 text-zinc-600 hover:text-zinc-700 hover:cursor-pointer"  size={15} onClick={() => setShowMetadataModal(false)} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="ml-auto mr-2"><TextViewsToggle /></div>
        <Actions />
      </div>
      <div className="flex justify-center mb-4">
        <NavigationButton isPrev={true} />
        {<PanelTitle />}
        <NavigationButton />
      </div>
      <div className="flex justify-center">
        {<ContentTypesToggle />}
      </div>
    </div>
  )
}

export default PanelHeader
