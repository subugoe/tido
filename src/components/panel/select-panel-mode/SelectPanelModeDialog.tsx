import { FC, useRef, useState } from 'react'

import { useUIStore } from '@/store/UIStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader, DialogOverlay, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button.tsx'
import { PanelMode } from '@/types'
import Modes from '@/components/panel/select-panel-mode/Modes.tsx'
import DontAskAgain from '@/components/panel/select-panel-mode/DontAskAgain.tsx'


interface SelectPanelModeProps {
  parentEl?: HTMLElement,
}

const SelectPanelModeDialog: FC<SelectPanelModeProps> = ({ parentEl }) => {
  const [showDialog, setShowDialog] = useState(true)
  const { panelState, updatePanel } = usePanel()
  const UIState = useUIStore.getState()

  const [selectedMode, setSelectedMode] = useState(UIState.defaultPanelMode)
  const updateEnabledSelectPanelMode = UIState.updateEnabledSelectPanelMode
  const { t } = useTranslation()

  const isChecked = useRef<boolean>(false)


  function handleConfirm(selectedMode: PanelMode) {
    const newMode = panelState.imageExists ? selectedMode : 'text'
    updatePanel({ mode: newMode })
    useUIStore.getState().updatePanelMode(selectedMode)

    if (isChecked.current) updateEnabledSelectPanelMode(false)
    setShowDialog(false)
    useUIStore.getState().updateShowSelectPanelMode(false)
  }

  function updateCheckedValue(newValue) {
    isChecked.current = newValue
  }


  return (
    <Dialog open={showDialog}>
      <DialogContent className={`absolute top-1/2 left-1/2 flex flex-col gap-y-4 w-fit p-4 justify-start`}
        container={parentEl}
        customOverlay={<DialogOverlay className="absolute bg-white opacity-[20%]" />}
        showClose={false}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="text-[15px]">{ t('please_select_mode') }</div>
          </DialogTitle>
        </DialogHeader>
        <Modes updateSelectedButton={setSelectedMode} />
        <div className="flex">
          <DialogFooter className="flex mt-2 w-full">
            <DontAskAgain onChange={updateCheckedValue} />
            <Button className="ml-auto" onClick={() => handleConfirm(selectedMode)}> {t('confirm')}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SelectPanelModeDialog
