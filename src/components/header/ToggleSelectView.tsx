import { FC, useEffect, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'
import { useTranslation } from 'react-i18next'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'


const ToggleSelectView: FC = () => {
  const [enabled, setEnabled]  = useState(useUIStore.getState().enabledSelectTextView)
  const updateEnabledSelectViewModal = useUIStore.getState().updateEnabledSelectTextView
  const allowSelectViewModal = useUIStore(state => state.enabledSelectTextView)
  const { t } = useTranslation()

  useEffect(() => {
    setEnabled(allowSelectViewModal)
  }, [allowSelectViewModal])

  function handleSwitchClick(e) {
    e.stopPropagation()
    if (enabled) {
      setEnabled(false)
      updateEnabledSelectViewModal(false)
      return
    }
    setEnabled(true)
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
