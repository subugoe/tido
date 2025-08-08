import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/UIStore.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'

import { AlignCenter, Columns2, Image, PictureInPicture2 } from 'lucide-react'
import { PanelModeButtonData, PanelMode } from '@/types'
import { Button } from '@/components/ui/button.tsx'

import { filterAndSortData } from '@/utils/panel.ts'

interface SelectPanelModeButtonsProps {
  updateSelectedButton: (selectedMode: PanelMode) => void
}

const Modes: FC<SelectPanelModeButtonsProps> = ({ updateSelectedButton }) => {
  const { t } = useTranslation()
  const panelModes = useConfigStore(state => state.config.panelModes)
  const [selectedPanelMode, setSelectedPanelMode] = useState(useUIStore.getState().defaultPanelMode)


  const defaultButtonsData: PanelModeButtonData[] = [ {
    mode : 'swap',
    icon: PictureInPicture2,
    title: t('pip_mode')
  },{
    mode : 'split',
    icon: Columns2 ,
    title: t('split_mode')
  },{
    mode: 'text',
    icon: AlignCenter ,
    title: t('text_mode')
  },{
    mode: 'image',
    icon: Image,
    title: t('image_mode')
  },
  ]

  const buttonsData: PanelModeButtonData[] = filterAndSortData(defaultButtonsData, 'mode', panelModes)

  function setSelectedButton(key: PanelMode) {
    setSelectedPanelMode(key)
    updateSelectedButton(key)
  }



  return (
    <div className="flex relative justify-start" data-cy="modes-container">
      <div className="flex gap-x-4" data-cy="modes">
        {buttonsData.map((button, i) => {
          const Icon = button.icon
          const mode = button.mode
          return (
            <div className="flex flex-col" key={mode+'_'+i}>
              <Button variant={selectedPanelMode === mode ? 'secondary': 'ghost'}
                className={`flex justify-center hover:bg-muted w-21 h-21 ${selectedPanelMode === mode ? 'active shadow-sm bg-muted': ''}`}
                onClick={() => setSelectedButton(mode)}
                data-cy={mode}
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

export default Modes
