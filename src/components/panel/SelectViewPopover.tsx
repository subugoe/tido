import { FC, useState } from 'react'
import { Popover, PopoverContent } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/UIStore.tsx'
import { AlignCenter, Columns2, Image, PictureInPicture2 } from 'lucide-react'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Checkbox } from '@/components/ui/checkbox'
import { useConfigStore } from '@/store/ConfigStore.tsx'


const SelectViewPopover: FC = () => {
  const [showPopover, setShowPopover] = useState(useUIStore.getState().showSelectViewPopover)
  const updateShowSelectViewPopover = useUIStore.getState().updateShowSelectViewPopover
  const defaultView = useConfigStore.getState().config.defaultView
  const { t } = useTranslation()

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


  return (
    <Popover open={showPopover} onOpenChange={handleOpenChange} >
      <PopoverTrigger />
      {showPopover && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-2 w-[250px] h-[300px] pl-2 pt-2 justify-start">
        <div>{ t('Please select the view to show the text') }</div>
        {Object.keys(buttonsData).map((key, i) => (
          <Button variant={defaultView === key ? 'secondary': 'ghost'} key={key+'_'+i} className="flex justify-start">
            <div className="flex space-x-1">
              <div>{buttonsData[key].icon} </div>
              <div>{buttonsData[key].title}</div>
            </div>
          </Button>
        )
        )}
        <div className="flex items-center space-x-2 mt-2 ml-2">
          <Checkbox id="do-not-ask-again"  />
          <label
            htmlFor="do-not-ask-again"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Do not ask again
          </label>
        </div>
      </PopoverContent>}
    </Popover>
  )
}

export default SelectViewPopover
