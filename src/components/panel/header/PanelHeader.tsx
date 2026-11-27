import { FC } from 'react'
import { MoreVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'

import { useManifestSwitcher } from '@/components/panel/header/useManifestSwitcher.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/constants.ts'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import FullScreenToggle from '@/components/panel/header/FullScreenToggle.tsx'
import ViewToggles from '@/components/panel/header/ViewToggles.tsx'
import PanelBreadcrumb from '@/components/panel/header/PanelBreadcrumb.tsx'
import PrevItemButton from '@/components/panel/navigation/PrevItemButton.tsx'
import NextItemButton from '@/components/panel/navigation/NextItemButton.tsx'

const PanelHeader: FC = () => {
  const { usePanelTranslation, remove, panelRootRef } = usePanel()
  const { t } = usePanelTranslation()
  const switcher = useManifestSwitcher()

  return (
    // In wide panels three columns: the view toggles centered in the header, the title and the panel actions
    // sharing the room left and right of them equally. In narrow panels the title takes all the room left
    // and the toggles sit on the right, next to the actions.
    <div
      className="flex @min-[700px]/panel:grid @min-[700px]/panel:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-border px-2 bg-background"
      style={{ height: `${PANEL_HEADER_HEIGHT}px` }}
    >
      {/* where the panel is, and the way to the previous and next item - across manifests */}
      <div className="flex items-center gap-1 min-w-0 flex-1" data-cy="panel-title-and-nav-arrows">
        <PanelBreadcrumb switcher={switcher} />
        <div className="flex items-center shrink-0">
          <PrevItemButton />
          <NextItemButton />
        </div>
      </div>
      {/* always in place, so the actions stay in the last column when a panel has no view toggles */}
      <div className="flex justify-center min-w-0 shrink-0">
        <ViewToggles />
      </div>
      <div className="flex items-center justify-end gap-1 shrink-0 @min-[600px]/panel:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-cy="panel-menu">
            <Button size="iconSm" variant="ghost">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-cy="panel-menu-dropdown" container={panelRootRef.current}>
            <FullScreenToggle />
          </DropdownMenuContent>
        </DropdownMenu>
        <BaseTooltip message={t('close_panel')}>
          <Button size="iconSm" variant="ghost" onClick={remove} aria-label={t('close_panel')} data-cy="close-panel">
            <X />
          </Button>
        </BaseTooltip>
      </div>
    </div>
  )
}

export default PanelHeader
