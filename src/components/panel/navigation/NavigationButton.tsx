import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
interface Props {
  isPrev?: boolean
  isDisabled?: boolean
  navigate: () => void
  dataCy?: string
  tooltipKey: string
}

const NavigationButton: FC<Props> = ({ isPrev = false, isDisabled = false, navigate, dataCy, tooltipKey }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="outline"
        size="iconSm"
        disabled={isDisabled}
        onClick={navigate}
        data-cy={dataCy}>
        { isPrev ? <ChevronLeft /> : <ChevronRight /> }
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <span className="leading-none">{ t(tooltipKey) }</span>
    </TooltipContent>
  </Tooltip>
}

export default NavigationButton
