import { FC, MouseEvent } from 'react'

import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'
import { useTranslation } from 'react-i18next'
import { useConfigStore } from '@/store/ConfigStore.tsx'

import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { PictureInPicture2, Image, AlignCenter, Columns2 } from 'lucide-react'

import { ViewButtonData, ViewType } from '@/types'
import { filterAndSortData } from '@/utils/panel.ts'


const TextViewsToggle: FC = () => {
  const { t } = useTranslation()
  const { panelState } = usePanel()
  const updatePanel = usePanelStore((state) => state.updatePanel)
  const views = useConfigStore(state => state.config.views)


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
    icon: Image ,
    title: t('image_view')
  },
  ]

  const buttonsData: ViewButtonData[] = filterAndSortData(defaultButtonsData, 'view', views)

  function handleTextViewClick(
    e: MouseEvent<HTMLButtonElement>,
    newView: ViewType
  ) {
    e.preventDefault()
    if (!panelState) return
    updatePanel(panelState.id, { view: newView })
  }

  function isDisabled(buttonView: ViewType) {
    return (!panelState.imageExists && ['image', 'swap', 'split'].includes(buttonView))
      || !panelState.contentTypes?.length
  }


  return (
    <>
      { !panelState && <Skeleton /> }
      { panelState &&
        <div className="flex gap-1">
          {buttonsData.map((button) => {
            const Icon = button.icon

            return (<TooltipProvider key={button.view} delayDuration={400}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => handleTextViewClick(e, button.view)}
                    variant={panelState.view === button.view ? 'secondary' : 'ghost'}
                    size="icon"
                    disabled={isDisabled(button.view)}
                    data-selected={panelState.view === button.view}
                    data-cy={button.view}
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

export default TextViewsToggle
