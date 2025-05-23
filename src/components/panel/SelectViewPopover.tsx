import { FC, useRef, useState } from 'react'
import { Popover, PopoverContent } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/UIStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { AlignCenter, Columns2, Image, PictureInPicture2 } from 'lucide-react'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Checkbox } from '@/components/ui/checkbox'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { ViewType } from '@/types'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { mapToViewIndex } from '@/utils/panel.ts'


const SelectViewPopover: FC = () => {
  const [showPopover, setShowPopover] = useState(useUIStore.getState().showSelectViewPopover)
  const { panelState } = usePanel()
  const configStore = useConfigStore()
  const updateShowSelectViewPopover = useUIStore.getState().updateShowSelectViewPopover
  const [selectedView, setSelectedView] = useState(configStore.config.defaultView)
  const udpateEnabledSelectViewPopover = useUIStore.getState().updateEnabledSelectViewPopover
  const { t } = useTranslation()

  const isCheckboxChecked = useRef<boolean>(false)

  const buttonsData = {
    pip: {
      icon: <PictureInPicture2 />,
      title: t('pip_view')
    },
    split: {
      icon: <Columns2 />,
      title: t('split_view')
    },
    text: {
      icon: <AlignCenter />,
      title: t('text_view')
    },
    image: {
      icon: <Image />,
      title: t('image_view')
    },
  }


  const handleOpenChange = (open: boolean) => {
    updateShowSelectViewPopover(open)
    setShowPopover(open)
  }

  function handleConfirm(selectedView: ViewType) {
    usePanelStore.getState().updatePanel(panelState.id, { viewIndex: mapToViewIndex(selectedView) })
    configStore.updateConfig({ defaultView: selectedView })
    if (isCheckboxChecked.current) udpateEnabledSelectViewPopover(false)
    setShowPopover(false)
  }



  return (
    <Popover open={showPopover} onOpenChange={handleOpenChange} >
      <PopoverTrigger />
      {showPopover && <PopoverContent side="bottom" align="start" sideOffset={8} className="relative flex flex-col space-y-2 w-[250px] h-[350px] pl-2 pt-2 justify-start">
        <div>{ t('Please select the view to show the text') }</div>
        {Object.keys(buttonsData).map((key: ViewType, i) => (
          <Button variant={selectedView === key ? 'secondary': 'ghost'} key={key+'_'+i}
            className="flex justify-start"
            onClick={() => setSelectedView(key)}>
            <div className="flex space-x-1">
              <div>{buttonsData[key].icon} </div>
              <div>{buttonsData[key].title}</div>
            </div>
          </Button>
        )
        )}
        <div className="flex items-center space-x-2 mt-4 ml-2">
          <Checkbox id="do-not-ask-again" onCheckedChange={(checked) => {
            isCheckboxChecked.current = !!checked
          }}  />
          <label
            htmlFor="do-not-ask-again"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Do not ask again
          </label>
        </div>
        <Button className="absolute bottom-4 right-4" onClick={() => handleConfirm(selectedView)}> {t('Confirm')}</Button>
      </PopoverContent>}
    </Popover>
  )
}

export default SelectViewPopover
