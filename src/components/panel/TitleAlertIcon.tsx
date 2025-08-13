import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { FC } from 'react'
import { CircleAlert } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'

const TitleAlertIcon: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <TooltipProvider delayDuration={400}>
    <Tooltip>
      <TooltipTrigger asChild>
        <CircleAlert className="absolute w-5 h-5 rounded-full top-0 -mt-1 right-1 text-white bg-yellow-500 stroke-2" />
      </TooltipTrigger>
      <TooltipContent>
        <span className="leading-none">{ t('select_item_to_continue') }</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
}

export default TitleAlertIcon
