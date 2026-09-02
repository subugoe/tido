import { FC, useState } from 'react'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'

import Metadata from '@/components/metadata/Metadata.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { PANEL_FOOTER_HEIGHT } from '@/utils/constants.ts'
import SyncTargetNavigation from '@/components/panel/synopsis/TargetNavigation.tsx'

const PanelFooter: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const handleOpenChange = (open: boolean) => {
    setShowMetadataModal(open)
  }

  return (
    <div
      className="relative flex items-center border-t border-border px-2 bg-background"
      style={{ height: `${PANEL_FOOTER_HEIGHT}px` }}
    >
      <div className="absolute h-full left-2 flex items-center">
        <Popover open={showMetadataModal} onOpenChange={handleOpenChange} modal={true}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setShowMetadataModal(!showMetadataModal)}
              variant={showMetadataModal ? 'secondary' : 'outline'}
              size={'xs'}
              title={t('metadata')}
              data-cy="metadata-toggle"
            >
              {<Info />}
              Metadata
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-[400px] pr-0">
            <Metadata />
            <X
              className="absolute right-3 top-4 text-zinc-600 hover:text-zinc-700 hover:cursor-pointer"
              size={15} onClick={() => setShowMetadataModal(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mx-auto">
        <SyncTargetNavigation />
      </div>
    </div>
  )
}

export default PanelFooter
