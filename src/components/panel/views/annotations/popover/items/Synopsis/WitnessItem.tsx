import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { cn } from '@/lib/utils'
import { WitnessError, WitnessTargets } from '@/utils/annotations.ts'
import WitnessItemError from '@/components/panel/views/annotations/popover/items/Synopsis/WitnessItemError.tsx'
import WitnessTooltip from '@/components/panel/views/annotations/popover/items/Synopsis/WitnessTooltip.tsx'

interface Props {
  syncedTarget: WitnessTargets
  isOpened: boolean
  isSelected: boolean
  onSelect: () => void
  // set when the witness can not be navigated to - the item is then shown disabled
  error?: WitnessError
  // set while the witness is being checked - it is shown as a skeleton and can't be selected yet
  pending?: boolean
  selectOnly?: boolean
}

const COUNT_BADGE_CLASSES = 'inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-medium leading-none text-primary'

const WitnessItem: FC<Props> = ({ syncedTarget, isOpened, isSelected, onSelect, error, pending = false, selectOnly = false }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const { syncTarget, count } = syncedTarget
  const [label, setLabel] = useState('')

  useEffect(() => {
    async function loadLabel() {
      if (!syncTarget.source.manifest) return
      try {
        const manifest = await useDataStore.getState().initManifest(syncTarget.source.manifest)
        setLabel(manifest.titles?.[0] ?? t('unknown_witness'))
      } catch {
        setLabel(t('unknown_witness'))
      }
    }

    loadLabel()
  }, [])

  // the same box as the witness button below (border, padding, a text-sm line), so the list does not
  // shift when the check finishes
  if (pending) return (
    <div
      data-cy="witness-item-pending"
      aria-busy
      className="flex items-center gap-2 w-full rounded-md border border-border px-3 py-1.5"
    >
      {!selectOnly && <Skeleton className="size-4 shrink-0 rounded-[4px]" />}
      <div className="flex h-5 flex-1 items-center">
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  )

  if (error) return <WitnessItemError label={label} error={error} selectOnly={selectOnly} />

  const hasMultipleTargets = count > 1

  const button = (
    <button
      type="button"
      data-cy="witness-item"
      {...(isSelected ? { 'data-selected': '' } : {})}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2 w-full rounded-md border px-3 py-1.5 text-left transition-colors cursor-pointer',
        isSelected
          ? 'bg-primary/5 border-primary/40 hover:bg-primary/10'
          : 'border-border hover:bg-muted'
      )}
    >
      {!selectOnly && <Checkbox checked={isSelected} tabIndex={-1} className="pointer-events-none" />}
      {/* the label takes the free space, so the badges sit at the right edge - the count rightmost */}
      <span data-cy="witness-label" className="flex-1 truncate text-sm">{label}</span>
      {!selectOnly && isOpened && (
        <Badge className="shrink-0 border-transparent bg-green-100 text-green-700 font-semibold dark:bg-green-900/30 dark:text-green-400">
          {t('witness_open')}
        </Badge>
      )}
      {hasMultipleTargets && (
        <span data-cy="witness-targets-count" className={cn(COUNT_BADGE_CLASSES, 'shrink-0 border border-primary')}>
          {count}
        </span>
      )}
    </button>
  )

  if (!hasMultipleTargets) return button

  return (
    <WitnessTooltip
      data-cy="witness-targets-tooltip"
      title={t('multiple_sync_targets')}
      description={t('multiple_sync_targets_description', { count })}
    >
      {button}
    </WitnessTooltip>
  )
}

export default WitnessItem
