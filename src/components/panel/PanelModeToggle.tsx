import { FC, MouseEvent } from 'react'

import { usePanel } from '@/contexts/PanelContext'
import { useConfigStore } from '@/store/ConfigStore.tsx'

import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { PictureInPicture2, Image, AlignCenter, Columns2 } from 'lucide-react'

import { PanelModeButtonData, PanelMode } from '@/types'
import { filterAndSortData } from '@/utils/panel.ts'


const PanelModeToggle: FC = () => {
  const { panelState, updatePanel, setFilteredAnnotations, usePanelTranslation, resizer } = usePanel()
  const { t } = usePanelTranslation()
  const panelModes = useConfigStore.getState().config.panelModes

  const defaultButtonsData: PanelModeButtonData[] = [{
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
    icon: Image ,
    title: t('image_mode')
  }]

  const buttonsData: PanelModeButtonData[] = filterAndSortData(defaultButtonsData, 'mode', panelModes)

  function handlePanelModeClick(
    e: MouseEvent<HTMLButtonElement>,
    newPanelMode: PanelMode
  ) {
    e.preventDefault()
    if (!panelState) return
    updatePanel({ mode: newPanelMode })
    resizer.setPanelMode(newPanelMode)
    setFilteredAnnotations([])
  }

  function isDisabled(buttonPanelMode: PanelMode) {
    return (!panelState.imageExists && ['image', 'swap', 'split'].includes(buttonPanelMode))
      || !panelState.contentTypes?.length
  }

  return (
    <>
      { !panelState && <Skeleton /> }
      { panelState && buttonsData.length > 1 &&
        <div className="flex gap-1" data-cy="panel-modes-toggle">
          {buttonsData.map((button) => {
            const Icon = button.icon

            return (<TooltipProvider key={button.mode} delayDuration={400}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => handlePanelModeClick(e, button.mode)}
                    variant={panelState.mode === button.mode ? 'secondary' : 'ghost'}
                    size="icon"
                    disabled={isDisabled(button.mode)}
                    data-selected={panelState.mode === button.mode}
                    data-cy={button.mode}
                  >
                    <Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="leading-none">{ button.title }</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>)
          })}
        </div>
      }
    </>
  )
}

export default PanelModeToggle
