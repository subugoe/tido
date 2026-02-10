import { FC, memo, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

import PanelTitle from '@/components/panel/PanelTitle.tsx'
import CollectionTitle from '@/components/panel/CollectionTitle.tsx'
import Metadata from '@/components/metadata/Metadata'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/panel.ts'
import PanelViewsMenu from '@/components/panel/PanelViewsMenu.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'

const SidebarToggle = memo((props) => {
  const { panelState, updatePanel, usePanelTranslation } = usePanel()
  const [tooltipMessage, setTooltipMessage] = useState('')
  const { t } = usePanelTranslation()

  useEffect(() => {
    setTooltipMessage(t(panelState.annotationsOpen ? 'hide_annotations' : 'display_annotations'))
  }, [panelState.annotationsOpen])

  function onClick() {
    updatePanel({
      annotationsOpen: !panelState.annotationsOpen
    })
  }

  return <BaseTooltip message={tooltipMessage}>
    <Button
      variant={panelState.annotationsOpen ? 'secondary' : 'outline'}
      size="sm"
      {...props}
      onClick={onClick} data-cy="sidebar-toggle"
    >
      { t('annotations') }
    </Button>
  </BaseTooltip>
})

const PanelHeader: FC = () => {
  const { usePanelTranslation, remove } = usePanel()
  const { t } = usePanelTranslation()
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const { panelState } = usePanel()
  const handleOpenChange = (open: boolean) => {
    setShowMetadataModal(open)
  }

  return (
    <div className="flex items-center border-b border-border p-3" style={{ height: `${PANEL_HEADER_HEIGHT}px` }}>
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
      <div className="mx-auto flex justify-center" data-cy="panel-title-and-nav-arrows">
        {<PanelTitle />}
      </div>
      <div className="ml-auto flex gap-2 mr-2">
        <PanelViewsMenu />
        <SidebarToggle />
      </div>
      <div className="flex gap-1">
        <BaseTooltip message={t('close_panel')}>
          <Button size="icon" variant="ghost" onClick={remove}><X className="text-destructie" /></Button>
        </BaseTooltip>
      </div>
    </div>
  )
}

export default PanelHeader
