import { FC, memo, useEffect, useState } from 'react'
import { MoreVertical, Image, AlignCenter, FileQuestionMark, MessageSquareText, X, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Switch } from '@/components/ui/switch.tsx'

import PanelTitle from '@/components/panel/header/PanelTitle.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/constants.ts'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { getFilteredAnnotations } from '@/utils/annotations.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import CollectionTitle from '@/components/panel/header/CollectionTitle.tsx'
import { cn } from '@/lib/utils'

interface PanelView {
  icon: LucideIcon
  label: string
  visible: boolean
}

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
      filteredAnnotations.push(...filtered.filter(a => !tooltipTypes.includes((a.body as AnnotationBody).annotationType)))
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
      variant="outline"
      size="sm"
      {...props}
      className={cn('group', panelState.showSidebar ? 'ring-1 ring-secondary/50 border-secondary' : '')}
      onClick={onClick} data-cy="sidebar-toggle"
    >
      <span className="hidden @min-[1000px]/panel:inline">{ t('annotations') }</span>
      <MessageSquareText className="hidden @max-[999px]/panel:inline" />
      <Badge className={`px-1.5 py-0.5 rounded-full text-xs leading-none  transition-colors ${panelState.showSidebar ? '' : 'text-foreground group-hover:bg-accent'}`} variant={panelState.showSidebar ? 'secondary' : 'muted'}>
        { filteredAnnotations.length }
      </Badge>
    </Button>
  </BaseTooltip>
})

const PanelHeader: FC = () => {
  const { panelState, usePanelTranslation, updatePanel, remove } = usePanel()
  const { t } = usePanelTranslation()
  const [views, setViews] = useState<PanelView[]>([])

  useEffect(() => {
    const data = panelState.panelViews.map(({ view, label, visible }) => ({
      icon: view === 'text' ? AlignCenter : view === 'image' ? Image : FileQuestionMark,
      label,
      visible
    }))
    setViews(data)
  }, [panelState.panelViews])

  function updateView(index: number, visible: boolean) {
    if (!visible && views.filter(v => v.visible).length === 1) return

    views[index].visible = visible
    updatePanel({
      panelViews: views.map(({ visible }, i) => ({ ...panelState.panelViews[i], visible }))
    })
  }

  return (
    <div className="relative flex items-center border-b border-border px-2 bg-background" style={{ height: `${PANEL_HEADER_HEIGHT}px` }}>
      <CollectionTitle />
      <div className="mx-auto flex items-center gap-1 overflow-x-clip" data-cy="panel-title-and-nav-arrows">
        <PanelTitle />
      </div>
      <div className="absolute h-full top-0 right-2 flex items-center gap-1 @min-[600px]/panel:gap-2">
        <SidebarToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-cy="panel-menu">
            <Button size="iconSm" variant="ghost">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-cy="panel-menu-dropdown">
            {views.length > 1 && views.map((view, i) => {
              const Icon = view.icon
              return (
                <DropdownMenuItem key={i} className="focus:bg-transparent cursor-default" onSelect={e => e.preventDefault()}>
                  <Icon size={16} />
                  {view.label}
                  <Switch
                    className="ml-auto"
                    data-cy="panel-view-toggle"
                    onCheckedChange={(checked) => updateView(i, checked)}
                    checked={view.visible}
                  />
                </DropdownMenuItem>
              )
            })}
            {views.length > 1 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={remove}
              data-cy="close-panel"
            >
              <X size={16} />
              {t('close_panel')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default PanelHeader
