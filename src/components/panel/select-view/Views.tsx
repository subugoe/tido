import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/UIStore.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'

import { AlignCenter, Columns2, Image, PictureInPicture2 } from 'lucide-react'
import { ViewButtonData, ViewType } from '@/types'
import { Button } from '@/components/ui/button.tsx'

import { filterAndSortData } from '@/utils/panel.ts'

interface SelectViewButtonsProps {
  updateSelectedButton: (selectedView: ViewType) => void
}

const Views: FC<SelectViewButtonsProps> = ({ updateSelectedButton }) => {
  const { t } = useTranslation()
  const views = useConfigStore(state => state.config.views)
  const [selectedView, setSelectedView] = useState(useUIStore.getState().defaultView)


  const defaultButtonsData: ViewButtonData[] = [ {
    view : 'swap',
    icon: PictureInPicture2,
    title: t('pip_view')
  },{
    view : 'split',
    icon: Columns2 ,
    title: t('split_view')
  },{
    view: 'text',
    icon: AlignCenter ,
    title: t('text_view')
  },{
    view: 'image',
    icon: Image,
    title: t('image_view')
  },
  ]

  const buttonsData: ViewButtonData[] = filterAndSortData(defaultButtonsData, 'view', views)

  function setSelectedButton(key: ViewType) {
    setSelectedView(key)
    updateSelectedButton(key)
  }



  return (
    <div className="flex relative justify-start">
      <div className="flex gap-x-4">
        {buttonsData.map((button, i) => {
          const Icon = button.icon
          const view = button.view
          return (
            <div className="flex flex-col" key={view+'_'+i}>
              <Button variant={selectedView === view ? 'secondary': 'ghost'}
                className={`flex justify-center hover:bg-muted w-21 h-21 ${selectedView === view ? 'shadow-sm bg-muted': ''}`}
                onClick={() => setSelectedButton(view)}
                data-cy={view}
              >
                <Icon className="size-16 stroke-1" />
              </Button>
              <span className="leading-none self-center text-sm mt-2">{ button.title.split('-')[0] }</span>
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}

export default Views
