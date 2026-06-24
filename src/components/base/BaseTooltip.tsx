import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { FC, memo, ReactNode } from 'react'


interface Props {
  children: ReactNode,
  message: string
}
const BaseTooltip: FC<Props> = memo(({ children, message = '' }) => {

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
})

export default BaseTooltip
