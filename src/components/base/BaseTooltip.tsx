import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { FC, memo, ReactNode, useContext } from 'react'
import { PanelContext } from '@/contexts/PanelContext.tsx'


interface Props {
  children: ReactNode,
  message: string
}
const BaseTooltip: FC<Props> = memo(({ children, message = '' }) => {
  // BaseTooltip is used inside and outside panels. Inside one, the tooltip has to render into the panel's
  // own container so that it stays visible while the panel is in fullscreen.
  const panelContext = useContext(PanelContext)

  return <TooltipProvider delayDuration={400}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          { children }
        </div>
      </TooltipTrigger>
      <TooltipContent container={panelContext?.panelRootRef?.current}>
        <span className="leading-none">{ message }</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
})

export default BaseTooltip
