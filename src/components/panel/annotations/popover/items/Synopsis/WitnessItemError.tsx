import { FC } from 'react'
import { TriangleAlert } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { WitnessError } from '@/utils/annotations.ts'
import WitnessTooltip from '@/components/panel/annotations/popover/items/Synopsis/WitnessTooltip.tsx'

interface Props {
  label: string
  error: WitnessError
  selectOnly?: boolean
}

// Disabled witness: its text is not part of its item, or the synced target is not found in the text.
// A tooltip tells what went wrong.
const WitnessItemError: FC<Props> = ({ label, error, selectOnly = false }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return (
    <WitnessTooltip
      data-cy="witness-error-tooltip"
      title={t('synoptic_target_unavailable')}
      icon={<TriangleAlert data-cy="witness-error-icon" className="w-4 h-4 shrink-0 text-amber-500" />}
      description={t(error)}
    >
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
      </button>
    </WitnessTooltip>
  )
}

export default WitnessItemError
