import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfigStore } from '@/store/ConfigStore.tsx'


import { AlignCenter, Columns2, Image, PictureInPicture2 } from 'lucide-react'
import { ViewType } from '@/types'
import { Button } from '@/components/ui/button.tsx'

interface SelectViewButtonsProps {
  updateSelectedButton: (selectedView: ViewType) => void
}

const Views: FC<SelectViewButtonsProps> = ({ updateSelectedButton }) => {
  const [selectedView, setSelectedView] = useState(useConfigStore.getState().config.defaultView)
  const { t } = useTranslation()

  const buttonsData = {
    pip: {
      icon: PictureInPicture2,
      title: t('pip_view')
    },
    split: {
      icon: Columns2,
      title: t('split_view')
    },
    text: {
      icon: AlignCenter,
      title: t('text_view')
    },
    image: {
      icon: Image,
      title: t('image_view')
    },
  }

  function setSelectedButton(key: ViewType) {
    setSelectedView(key)
    updateSelectedButton(key)
  }



  return (
    <div className="flex relative justify-start">
      <div className="flex gap-x-4">
        {Object.keys(buttonsData).map((key: ViewType, i) => {
          const Icon = buttonsData[key].icon
          return (
            <div className="flex flex-col gap-y-4">
              <Button variant={selectedView === key ? 'secondary': 'ghost'} key={key+'_'+i}
                className={`flex justify-center hover:bg-muted w-21 h-21 ${selectedView === key ? 'shadow-sm bg-muted': ''}`}
                onClick={() => setSelectedButton(key)}
              >
                <Icon className="size-16 stroke-1" />
              </Button>
              <span className="leading-none self-center">{ buttonsData[key].title.split('-')[0] }</span>
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}

export default Views
