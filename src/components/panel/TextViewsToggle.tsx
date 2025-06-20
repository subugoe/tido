import { FC, MouseEvent } from 'react'
import { PictureInPicture2, Image, AlignCenter, Columns2 } from 'lucide-react'

import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { useTranslation } from 'react-i18next'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { filterAndSortData } from '@/utils/panel.ts'


const TextViewsToggle: FC = () => {
  const { t } = useTranslation()
  const { panelState } = usePanel()
  const updatePanel = usePanelStore((state) => state.updatePanel)
  const views = useConfigStore(state => state.config.views)

  const defaultButtonsData = {
    swap: {
      icon: <PictureInPicture2 />,
      tooltip: t('pip_view')
    },
    split: {
      icon: <Columns2 />,
      tooltip: t('split_view')
    },
    text: {
      icon: <AlignCenter />,
      tooltip: t('text_view')
    },
    image: {
      icon: <Image />,
      tooltip: t('image_view')
    },
  }

  const buttonsData = filterAndSortData(defaultButtonsData, views)

  function handleTextViewClick(
    e: MouseEvent<HTMLButtonElement>,
    newIndex: number
  ) {
    e.preventDefault()
    if (!panelState) return
    updatePanel(panelState.id, { viewIndex: newIndex })
  }

  return (
    <>
      { !panelState && <Skeleton /> }
      { panelState &&
        <div className="flex gap-1">
          {Object.keys(buttonsData).map((key, i) => (
            <TooltipProvider key={key} delayDuration={400}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => handleTextViewClick(e, i)}
                    variant={panelState.viewIndex === i ? 'secondary' : 'ghost'}
                    size="icon"
                    disabled={!panelState.contentTypes?.length}
                    data-selected={panelState.viewIndex === i}
                    data-cy={key}
                  >
                    { buttonsData[key].icon }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="leading-none">{ buttonsData[key].tooltip }</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      }
    </>
  )
}

export default TextViewsToggle
