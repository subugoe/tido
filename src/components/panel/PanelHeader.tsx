import { FC, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Info, PanelRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

import PanelModeToggle from '@/components/panel/PanelModeToggle.tsx'
import PanelTitle from '@/components/panel/PanelTitle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'
import NavigationButton from '@/components/panel/NavigationButton.tsx'
import Metadata from '@/components/metadata/Metadata'
import Actions from '@/components/panel/Actions.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTranslation } from 'react-i18next'

const SidebarToggle = (props) => {
  const { panelState, updatePanel } = usePanel()

  function onClick() {
    updatePanel({
      annotationsOpen: !panelState.annotationsOpen
    })
  }
  return <>
    <Button variant="ghost" size="icon" {...props} onClick={onClick}>
      <PanelRight />
    </Button>
  </>
}

const PanelHeader: FC = () => {
  const { t } = useTranslation()
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const { panelState } = usePanel()
  const handleOpenChange = (open: boolean) => {
    setShowMetadataModal(open)
  }

  return (
    <div className="flex flex-col">
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
                title={t('metadata')}
              >
                {<Info />}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-[400px] pr-0">
              <Metadata />
              <X
                className="absolute right-3 top-4 text-zinc-600 hover:text-zinc-700 hover:cursor-pointer"
                size={15} onClick={() => setShowMetadataModal(false)}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="ml-auto"><PanelModeToggle /></div>
        <Actions />
        <SidebarToggle className="ml-2" />
      </div>
      <div className="flex justify-center" data-cy="panel-title-and-nav-arrows">
        <NavigationButton isPrev={true} />
        {<PanelTitle />}
        <NavigationButton />
      </div>
    </div>
  )
}

export default PanelHeader
