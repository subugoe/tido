import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { FC, ReactNode } from 'react'


interface Props {
  children: ReactNode,
  message: string
}
const BaseTooltip: FC<Props> = ({ children, message = '' }) => {

  return <TooltipProvider delayDuration={400}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          { children }
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="leading-none">{ message }</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
}

export default BaseTooltip
