import { FC, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils'

interface RailIconButtonProps {
  active?: boolean
  onClick: () => void
  dataCy?: string
  tooltip: string
  children: ReactNode
  variant?: 'ghost' | 'primary'
}

const RailIconButton: FC<RailIconButtonProps> = ({
  active = false,
  onClick,
  dataCy,
  tooltip,
  children,
  variant = 'ghost'
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {variant === 'primary' ? (
          <Button
            size="iconLg"
            onClick={onClick}
            data-cy={dataCy}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            {children}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="iconLg"
            onClick={onClick}
            data-cy={dataCy}
            className={cn(
              'rounded-2xl transition-colors duration-200',
              active
                ? 'bg-primary/10 text-primary hover:bg-primary/15'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            {children}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span className="leading-none">{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export default RailIconButton
