import { FC, ReactNode, useState } from 'react'
import { Share2 } from 'lucide-react'
import { Menu, Plus, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils'
import GlobalTree from '@/components/tree/GlobalTree.tsx'
import AddNewPanelContent from '@/components/rail/AddNewPanelContent.tsx'
import SettingsContent from '@/components/rail/SettingsContent.tsx'
import RailIconButton from '@/components/rail/RailIconButton.tsx'
import ShareDialog from '@/components/rail/ShareDialog.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { useRailStore } from '@/store/RailStore.tsx'
import { useTranslation } from 'react-i18next'
import { RAIL_WIDTH, RAIL_EXPANDED_WIDTH } from '@/utils/constants.ts'

interface RailAction {
  id: string
  active: boolean
  onClick: () => void
  dataCy: string
  tooltip: string
  icon: ReactNode
  variant?: 'ghost' | 'primary'
}

const RailSidebar: FC = () => {
  const { showGlobalTree, showAddNewPanelButton, title: configuredTitle } = useConfig()
  const activeView = useRailStore(state => state.activeView)
  const toggleView = useRailStore(state => state.toggleView)
  const setActiveView = useRailStore(state => state.setActiveView)

  const [shareOpen, setShareOpen] = useState(false)

  const { t } = useTranslation()

  const isTreeActive = activeView === 'tree'
  const isAddActive = activeView === 'add'
  const isSettingsActive = activeView === 'settings'

  const activeTitle = activeView === 'tree'
    ? (configuredTitle || t('library'))
    : activeView === 'add'
      ? t('open_new_panel')
      : activeView === 'settings'
        ? t('settings')
        : ''

  const topActions: RailAction[] = []
  if (showGlobalTree) {
    topActions.push({
      id: 'tree',
      active: isTreeActive,
      onClick: () => toggleView('tree'),
      dataCy: 'rail-menu-toggle',
      tooltip: isTreeActive ? 'Close library' : 'Open library',
      icon: <Menu />
    })
  }
  if (showAddNewPanelButton) {
    topActions.push({
      id: 'add',
      active: isAddActive,
      onClick: () => toggleView('add'),
      dataCy: 'new-panel',
      tooltip: t('open_new_panel'),
      variant: 'primary',
      icon: <Plus />
    })
  }

  const bottomActions: RailAction[] = [
    {
      id: 'share',
      active: false,
      onClick: () => setShareOpen(true),
      dataCy: 'share',
      tooltip: t('generate_share_url'),
      icon: <Share2 />
    },
    {
      id: 'settings',
      active: isSettingsActive,
      onClick: () => toggleView('settings'),
      dataCy: 'settings',
      tooltip: t('settings'),
      icon: <Settings />
    }
  ]

  const renderActions = (actions: RailAction[]) =>
    actions.map(({ id, active, onClick, dataCy, tooltip, icon, variant }) => (
      <RailIconButton
        key={id}
        active={active}
        onClick={onClick}
        dataCy={dataCy}
        tooltip={tooltip}
        variant={variant}
      >
        {icon}
      </RailIconButton>
    ))

  return (
    <div className="flex" data-cy="rail-sidebar">
      <div
        style={{ width: RAIL_WIDTH }}
        className="shrink-0 flex flex-col border-r border-border"
      >
        <div className="flex flex-col items-center h-full py-4 gap-6">
          {renderActions(topActions)}

          <div className="mt-auto flex flex-col gap-3 px-2 pb-1">
            {renderActions(bottomActions)}
          </div>
        </div>
      </div>

      <div
        style={{ width: activeView ? RAIL_EXPANDED_WIDTH : 0 }}
        className={cn(
          'shrink-0 overflow-hidden transition-all duration-300 relative border-r border-border',
          activeView ? '' : 'border-r-0'
        )}
      >
        <div className="h-full flex flex-col px-3" style={{ width: RAIL_EXPANDED_WIDTH }}>
          <div className="flex items-start justify-between pl-3 pt-5 pb-2 shrink-0 mb-6">
            <h2 className="text-lg font-semibold" data-cy="rail-title">{activeTitle}</h2>
            {activeView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveView(null)}
                data-cy="rail-close"
              >
                <X />
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto pb-5">
            {activeView === 'tree' && <GlobalTree open />}
            {activeView === 'add' && <AddNewPanelContent />}
            {activeView === 'settings' && <SettingsContent />}
          </div>
        </div>
      </div>
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  )
}

export default RailSidebar
