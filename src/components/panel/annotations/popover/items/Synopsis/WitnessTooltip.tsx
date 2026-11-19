import { FC, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface Props {
  // the witness item the tooltip belongs to
  children: ReactNode
  title: string
  // shown right of the title
  icon?: ReactNode
  description: string
  'data-cy'?: string
}

// Tooltip card of a witness item: a title (with an optional icon next to it) and a description below.
const WitnessTooltip: FC<Props> = ({ children, title, icon, description, 'data-cy': dataCy }) => {
  const { panelRootRef } = usePanel()

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        data-cy={dataCy}
        container={panelRootRef.current}
        side="top"
        sideOffset={6}
        className="bg-background text-foreground rounded-xl shadow-lg px-3 py-2.5 w-[260px] text-pretty"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          {icon}
        </div>
        <p className="mt-1 text-xs leading-normal text-muted-foreground">{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default WitnessTooltip
