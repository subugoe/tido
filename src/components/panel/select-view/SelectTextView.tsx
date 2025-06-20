import { FC, useRef, useState } from 'react'

import { useUIStore } from '@/store/UIStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader, DialogOverlay, DialogPortal, DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button.tsx'
import { ViewType } from '@/types'
import Views from '@/components/panel/select-view/Views.tsx'
import DisableSelectView from '@/components/panel/select-view/DisableSelectView.tsx'

import { mapToViewIndex } from '@/utils/panel.ts'
import { useConfigStore } from '@/store/ConfigStore.tsx'


interface SelectTextViewProps {
  parentEl?: HTMLElement,
}

const SelectTextView: FC<SelectTextViewProps> = ({ parentEl }) => {
  const [showPopover, setShowPopover] = useState(true)
  const { panelState } = usePanel()
  const UIState = useUIStore.getState()
  const views = useConfigStore.getState().config.views

  const [selectedView, setSelectedView] = useState(UIState.defaultView)
  const updateEnabledSelectTextView = UIState.updateEnabledSelectTextView
  const { t } = useTranslation()

  const isChecked = useRef<boolean>(false)


  function handleConfirm(selectedView: ViewType) {
    usePanelStore.getState().updatePanel(panelState.id, { viewIndex: mapToViewIndex(selectedView, views) })
    useUIStore.getState().updateView(selectedView)

    if (isChecked.current) updateEnabledSelectTextView(false)
    setShowPopover(false)
    useUIStore.getState().updateShowSelectTextView(false)
  }

  function updateCheckedValue(newValue) {
    isChecked.current = newValue
  }


  return (
    <Dialog open={showPopover}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal container={parentEl}>
        <DialogOverlay className="absolute bg-white opacity-[20%]" />
        <DialogContent className={`absolute top-1/2 left-1/2 flex flex-col gap-y-4 w-fit
           p-4 justify-start`}
        showClose={false}>
          <DialogHeader>
            <DialogTitle>
              <div className="text-[15px]">{ t('please_select_view') }</div>
            </DialogTitle>
          </DialogHeader>
          <Views updateSelectedButton={setSelectedView} />
          <div className="flex">
            <DialogFooter className="flex mt-2 w-full">
              <DisableSelectView updateCheckedValue={updateCheckedValue} />
              <Button className="ml-auto" onClick={() => handleConfirm(selectedView)}> {t('confirm')}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SelectTextView
