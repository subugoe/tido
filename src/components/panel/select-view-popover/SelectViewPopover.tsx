import { FC, useRef, useState } from 'react'

import { useUIStore } from '@/store/UIStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useTranslation } from 'react-i18next'

import { Popover, PopoverContent } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { ViewType } from '@/types'
import SelectViewButtons from '@/components/panel/select-view-popover/SelectViewButtons.tsx'
import CheckboxInPopover from '@/components/panel/select-view-popover/CheckboxInPopover.tsx'

import { mapToViewIndex } from '@/utils/panel.ts'


interface SelectViewPopoverProps {
  animate: boolean
}

const SelectViewPopover: FC<SelectViewPopoverProps> = ({ animate }) => {
  const [showPopover, setShowPopover] = useState(useUIStore.getState().showSelectViewPopover)
  const { panelState } = usePanel()
  const updateShowSelectViewPopover = useUIStore.getState().updateShowSelectViewPopover
  const [selectedView, setSelectedView] = useState(useConfigStore().config.defaultView)
  const updateEnabledSelectViewPopover = useUIStore.getState().updateEnabledSelectViewPopover
  const { t } = useTranslation()

  const isChecked = useRef<boolean>(false)

  const handleOpenChange = (open: boolean) => {
    updateShowSelectViewPopover(open)
    setShowPopover(open)
  }

  function handleConfirm(selectedView: ViewType) {
    usePanelStore.getState().updatePanel(panelState.id, { viewIndex: mapToViewIndex(selectedView) })
    useConfigStore.getState().updateConfig({ defaultView: selectedView })
    if (isChecked.current) updateEnabledSelectViewPopover(false)
    setShowPopover(false)
    updateShowSelectViewPopover(false)
  }

  function updateCheckedValue(newValue) {
    isChecked.current = newValue
  }

  return (
    <div className={`
          absolute w-[350px] h-[400px]
          transition-all duration-700 ease-out
          ${animate ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'top-0 right-0'}`}>
      <Popover open={showPopover} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <div className="w-full opacity-0">Open</div>
        </PopoverTrigger>
        {showPopover && <PopoverContent side="bottom" align="start" sideOffset={8}
          className="absolute w-[300px] h-[350px] flex flex-col pl-2 pt-2 justify-start space-y-2">
          <div className="text-secondary-foreground">{ t('Please select the view to show the text') }</div>
          <SelectViewButtons updateSelectedButton={setSelectedView} />
          <CheckboxInPopover updateCheckedValue={updateCheckedValue} />
          <Button className="absolute bottom-4 right-4" onClick={() => handleConfirm(selectedView)}> {t('Confirm')}</Button>
        </PopoverContent>}
      </Popover>
    </div>
  )
}

export default SelectViewPopover
