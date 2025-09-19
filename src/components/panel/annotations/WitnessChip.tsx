import React, { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface Props {
  idno: string
}

const WitnessChip: FC<Props> = React.memo(({ idno }) => {
  const { witnesses, usePanelTranslation } = usePanel()

  const { t } = usePanelTranslation()

  function getWitnessLabel(idno: string) {
    return witnesses.find(w => w.idno === idno)?.idnoAlt ?? t('unknown_witness')
  }

  function getWitnessTitle(idno: string) {
    return witnesses.find(w => w.idno === idno)?.title ?? t('unknown_witness')
  }

  function getWitnessStyle(witnessIdno: string) {
    const witness = witnesses.find(w => w.idno === witnessIdno)
    return { backgroundColor: witness?.bgColor ?? 'var(--muted)', color: witness?.color ?? 'var(--muted-foreground)' }
  }

  return <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="rounded-full h-5 px-2 leading-none flex items-center justify-center bg-muted text-xs font-semibold"
          style={getWitnessStyle(idno)}
        >
          {getWitnessLabel(idno)}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="leading-none">{getWitnessTitle(idno)}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
})

export default WitnessChip
