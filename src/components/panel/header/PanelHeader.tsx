import { FC, memo, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

import PanelTitle from '@/components/panel/header/PanelTitle.tsx'
import CollectionTitle from '@/components/panel/header/CollectionTitle.tsx'
import Metadata from '@/components/metadata/Metadata.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/constants.ts'
import PanelViewsMenu from '@/components/panel/header/PanelViewsMenu.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { getFilteredAnnotations } from '@/utils/annotations.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'

const SidebarToggle = memo((props) => {
  const { annotations: annotationsConfig } = useConfig()
  const { panelState, updatePanel, usePanelTranslation, matchedAnnotationsMaps } = usePanel()
  const [tooltipMessage, setTooltipMessage] = useState('')
  const { t } = usePanelTranslation()


  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
  const filteredAnnotations: Annotation[] = []
  Object
    .keys(matchedAnnotationsMaps)
    .forEach(contentUrl => {
      const filtered = getFilteredAnnotations(matchedAnnotationsMaps[contentUrl])
      filteredAnnotations.push(...filtered.filter(a => !tooltipTypes.includes((a.body as AnnotationBody)['x-content-type'])))
    })

  useEffect(() => {
    setTooltipMessage(t(panelState.showSidebar ? 'hide_annotations' : 'display_annotations'))
  }, [panelState.showSidebar])

  function onClick() {
    updatePanel({
      showSidebar: !panelState.showSidebar
    })
  }

  return <BaseTooltip message={tooltipMessage}>
    <Button
      variant={panelState.showSidebar ? 'outline' : 'outline'}
      size="sm"
      {...props}
      className={panelState.showSidebar ? 'ring-1 ring-secondary/50 border-secondary' : ''}
      onClick={onClick} data-cy="sidebar-toggle"
    >
      { t('annotations') } <Badge className="px-1.5 py-0.5 rounded-full text-xs leading-none" variant={panelState.showSidebar ? 'secondary' : 'accent'}>{ filteredAnnotations.length }</Badge>
    </Button>
  </BaseTooltip>
})

const PanelHeader: FC = () => {
  const { usePanelTranslation, remove } = usePanel()
  const { t } = usePanelTranslation()
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const handleOpenChange = (open: boolean) => {
    setShowMetadataModal(open)
  }

  return (
    <div className="relative flex items-center border-b border-border p-3" style={{ height: `${PANEL_HEADER_HEIGHT}px` }}>
      <div className="@min-[1000px]/panel:absolute h-full flex items-center gap-1">
        <CollectionTitle />
        <Popover open={showMetadataModal} onOpenChange={handleOpenChange} modal={true}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setShowMetadataModal(!showMetadataModal)}
              variant={showMetadataModal ? 'secondary' : 'ghost'}
              size={'icon'}
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
      <div className="ml-4 @min-[1000px]/panel:mx-auto flex justify-center" data-cy="panel-title-and-nav-arrows">
        {<PanelTitle />}
      </div>
      <div className="absolute h-full top-0 right-2 flex items-center gap-2">
        <PanelViewsMenu />
        <SidebarToggle />
        <BaseTooltip message={t('close_panel')}>
          <Button size="icon" variant="ghost" onClick={remove}><X className="text-destructie" /></Button>
        </BaseTooltip>
      </div>
    </div>
  )
}

export default PanelHeader
