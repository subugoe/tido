import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { FC, ReactNode, useContext } from 'react'
import { PanelContext } from '@/contexts/PanelContext.tsx'

interface Props {
  children: ReactNode,
  message: string
}
const BaseTooltip: FC<Props> = ({ children, message = '' }) => {
  // since BaseTooltip can be used inside Panel. If there is containerRef in PanelContext - we can use it here to render for fullScreen
  const panelContext = useContext(PanelContext)

  return <TooltipProvider delayDuration={400}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          { children }
        </div>
      </TooltipTrigger>
      <TooltipContent container={panelContext?.containerRef?.current}>
        <span className="leading-none">{ message }</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
}

export default BaseTooltip
