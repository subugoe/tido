import { FC, useEffect, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'
import { useTranslation } from 'react-i18next'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'


const SelectViewPopoverSwitch: FC = () => {

  const [enabledSelectViewModal, setEnabledSelectViewModal]  = useState(useUIStore.getState().enabledSelectViewPopover)
  const updateEnabledSelectViewModal = useUIStore.getState().updateEnabledSelectViewPopover
  const allowSelectViewModal = useUIStore(state => state.enabledSelectViewPopover)
  const { t } = useTranslation()

  useEffect(() => {
    setEnabledSelectViewModal(allowSelectViewModal)
  }, [allowSelectViewModal])

  function handleSwitchClick(e) {
    e.stopPropagation()
    if (enabledSelectViewModal) {
      setEnabledSelectViewModal(false)
      updateEnabledSelectViewModal(false)
      return
    }
    setEnabledSelectViewModal(true)
    updateEnabledSelectViewModal(true)
  }

  return (
    <DropdownMenuItem>
      <div className="flex items-center space-x-2">
        <Label htmlFor="toggle-select-view-modal">{t('enable_select_view_modal')}</Label>
        <Switch id="toggle-select-view-modal"
          checked={enabledSelectViewModal}
          onCheckedChange={setEnabledSelectViewModal}
          onClick={(e) => handleSwitchClick(e)}
        />
      </div>
    </DropdownMenuItem>
  )
}

export default SelectViewPopoverSwitch



