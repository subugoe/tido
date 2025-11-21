import { FC } from 'react'

import { Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface Props {
  panelsNumbers: number[],
  nodeType: string
}

const OpenedIcon: FC<Props> = ({ panelsNumbers, nodeType }) => {

  const { t } = useTranslation()

  function getTooltip(nodeType: string, panelsNumbers: number[]) {
    let tooltip = ''
    if (nodeType === 'item') tooltip =  t('item_opened_in_panels' , { panelNumbers: panelsNumbers.join(',') })
    if (nodeType === 'manifest' || nodeType === 'collection') tooltip = t('contains_one_item_opened_in_panel', { panelNumbers: panelsNumbers.join(',') })

    return tooltip
  }

  function scrollToPanel(e) {
    if (panelsNumbers.length === 0) console.error('panelsNumbers should have at least one element in order to scroll to the respecive panel')
    e.stopPropagation()
    const firstPanelIndex = panelsNumbers[0] - 1 // index of first panel
    const panelEl = document.getElementById('panels-wrapper').childNodes[firstPanelIndex] as HTMLElement
    const scrollPosx = panelEl.offsetLeft - panelEl.offsetWidth / 2
    document.getElementById('panels-wrapper').scrollTo({ left: scrollPosx, behavior: 'smooth' })
  }


  return <><TooltipProvider delayDuration={600}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Circle className="text-green-500 fill-green-500 hover:scale-130 transition-all duration-300" size={10} fill="true" onClick={(e) => scrollToPanel(e)}  />
      </TooltipTrigger>
      <TooltipContent>
        <span className="leading-none">{ getTooltip(nodeType, panelsNumbers) }</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  </>
}

export default OpenedIcon
