import { FC, useEffect, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'
import { useTranslation } from 'react-i18next'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'


const ToggleSelectView: FC = () => {
  const [enabled, setEnabled]  = useState(useUIStore.getState().enabledSelectTextView)
  const { t } = useTranslation()

  const updateEnabledSelectViewModal = useUIStore.getState().updateEnabledSelectTextView
  const externalToggle = useUIStore(state => state.enabledSelectTextView)

  useEffect(() => {
    setEnabled(externalToggle)
  }, [externalToggle])

  function handleSwitchClick(e) {
    e.stopPropagation()
    if (enabled) {
      updateEnabledSelectViewModal(false)
      return
    }
    updateEnabledSelectViewModal(true)
  }

  return (
    <DropdownMenuItem>
      <div className="flex items-center space-x-2">
        <span className="hover:cursor-pointer">{t('enable_select_view_modal')}</span>
        <Switch id="toggle-select-view-modal"
          checked={enabled}
          onClick={(e) => handleSwitchClick(e)}
        />
      </div>
    </DropdownMenuItem>
  )
}

export default ToggleSelectView
