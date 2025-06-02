import { FC, useRef, useState } from 'react'

import { useUIStore } from '@/store/UIStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogHeader, DialogPortal, DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button.tsx'
import { ViewType } from '@/types'
import SelectViewButtons from '@/components/panel/select-view-popover/SelectViewButtons.tsx'
import CheckboxInPopover from '@/components/panel/select-view-popover/CheckboxInPopover.tsx'

import { mapToViewIndex } from '@/utils/panel.ts'


interface SelectViewPopoverProps {
  animate: boolean,
  parentEl?: HTMLElement,
}

const SelectViewPopover: FC<SelectViewPopoverProps> = ({ animate, parentEl }) => {
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
    useUIStore.getState().updateNewestPanelId('')
  }

  function handleConfirm(selectedView: ViewType) {
    usePanelStore.getState().updatePanel(panelState.id, { viewIndex: mapToViewIndex(selectedView) })
    useConfigStore.getState().updateConfig({ defaultView: selectedView })
    if (isChecked.current) updateEnabledSelectViewPopover(false)
    setShowPopover(false)
    useUIStore.getState().updateNewestPanelId('')
    updateShowSelectViewPopover(false)
  }

  function updateCheckedValue(newValue) {
    isChecked.current = newValue
  }

  return (
    <Dialog open={showPopover} onOpenChange={handleOpenChange}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal container={parentEl}>
        <DialogContent className={`absolute w-[500px] h-[250px] flex flex-col
           pl-2 pt-2 justify-start
          transition-all duration-900 ease-out
          ${animate ? `top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2` : 'top-0 right-0'}`}>
          <DialogHeader>
            <DialogTitle>
              <div className="text-muted-foreground">{ t('please_select_view_to_show_text') }</div>
            </DialogTitle>
          </DialogHeader>
          <SelectViewButtons updateSelectedButton={setSelectedView} />
          <CheckboxInPopover updateCheckedValue={updateCheckedValue} />
          <Button className="absolute bottom-4 right-4" onClick={() => handleConfirm(selectedView)}> {t('confirm')}</Button>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SelectViewPopover
