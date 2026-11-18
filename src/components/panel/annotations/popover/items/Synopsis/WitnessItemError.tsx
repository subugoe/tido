import { FC } from 'react'
import { TriangleAlert } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { WitnessError } from '@/utils/annotations.ts'

interface Props {
  label: string
  error: WitnessError
  selectOnly?: boolean
}

// Disabled witness: its text is not part of its item, or the synced target is not found in the text.
// A tooltip tells what went wrong.
const WitnessItemError: FC<Props> = ({ label, error, selectOnly = false }) => {
  const { usePanelTranslation, panelRootRef } = usePanel()
  const { t } = usePanelTranslation()

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        {/* aria-disabled instead of disabled: a disabled button gets no pointer events, so its tooltip would never open */}
        <button
          type="button"
          data-cy="witness-item"
          data-disabled=""
          aria-disabled
          className="flex items-center gap-2 w-full rounded-md border border-transparent bg-muted px-3 py-1.5 text-left text-muted-foreground cursor-not-allowed"
        >
          {!selectOnly && <Checkbox checked={false} disabled tabIndex={-1} className="pointer-events-none" />}
          <span data-cy="witness-label" className="flex-1 truncate text-sm">{label}</span>
          <TriangleAlert data-cy="witness-error-icon" className="w-4 h-4 shrink-0 text-amber-500" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        data-cy="witness-error-tooltip"
        container={panelRootRef.current}
        side="top"
        sideOffset={6}
        className="bg-background text-foreground rounded-xl shadow-lg px-3 py-2.5 w-[260px] text-pretty"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold leading-snug">{t('synoptic_target_unavailable')}</p>
          <TriangleAlert className="w-4 h-4 shrink-0 text-amber-500" />
        </div>
        <p className="mt-1 text-xs leading-normal text-muted-foreground">{t(error)}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default WitnessItemError
