import { FC, useEffect, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'
import { useTranslation } from 'react-i18next'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'


const ShowSelectPanelModeToggle: FC = () => {
  const [enabled, setEnabled]  = useState(useUIStore.getState().enabledSelectPanelMode)
  const { t } = useTranslation()

  const updateEnabledSelectModeModal = useUIStore.getState().updateEnabledSelectPanelMode
  const externalToggle = useUIStore(state => state.enabledSelectPanelMode)

  useEffect(() => {
    setEnabled(externalToggle)
  }, [externalToggle])

  function handleSwitchClick(e) {
    e.stopPropagation()
    if (enabled) {
      updateEnabledSelectModeModal(false)
      return
    }
    updateEnabledSelectModeModal(true)
  }

  return (
    <DropdownMenuItem>
      <div className="flex items-center space-x-2">
        <label htmlFor="toggle-select-panel-mode-dialog" className="cursor-pointer whitespace-nowrap">{t('enable_select_panel_mode_dialog')}</label>
        <Switch id="toggle-select-panel-mode-dialog"
          checked={enabled}
          onClick={(e) => handleSwitchClick(e)}
        />
      </div>
    </DropdownMenuItem>
  )
}

export default ShowSelectPanelModeToggle
