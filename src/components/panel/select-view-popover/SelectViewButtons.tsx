import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfigStore } from '@/store/ConfigStore.tsx'


import { AlignCenter, Columns2, Image, PictureInPicture2 } from 'lucide-react'
import { ViewType } from '@/types'
import { Button } from '@/components/ui/button.tsx'

interface SelectViewButtonsProps {
  updateSelectedButton: (selectedView: ViewType) => void
}

const SelectViewButtons: FC<SelectViewButtonsProps> = ({ updateSelectedButton }) => {
  const [selectedView, setSelectedView] = useState(useConfigStore.getState().config.defaultView)
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

  function setSelectedButton(key: ViewType) {
    setSelectedView(key)
    updateSelectedButton(key)
  }

  return (
    <>
      {Object.keys(buttonsData).map((key: ViewType, i) => (
        <Button variant={selectedView === key ? 'secondary': 'ghost'} key={key+'_'+i}
          className="flex justify-start"
          onClick={() => setSelectedButton(key)}>
          <div className="flex space-x-2">
            <div>{buttonsData[key].icon} </div>
            <div>{buttonsData[key].title}</div>
          </div>
        </Button>
      )
      )}
    </>
  )
}

export default SelectViewButtons
