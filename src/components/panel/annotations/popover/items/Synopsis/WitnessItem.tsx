import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { cn } from '@/lib/utils'
import { WitnessError, WitnessTargets } from '@/utils/annotations.ts'
import WitnessItemError from '@/components/panel/annotations/popover/items/Synopsis/WitnessItemError.tsx'
import WitnessTooltip from '@/components/panel/annotations/popover/items/Synopsis/WitnessTooltip.tsx'

interface Props {
  syncedTarget: WitnessTargets
  isOpened: boolean
  isSelected: boolean
  onSelect: () => void
  // set when the witness can not be navigated to - the item is then shown disabled
  error?: WitnessError
  selectOnly?: boolean
}

const COUNT_BADGE_CLASSES = 'inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-medium leading-none text-primary'

const WitnessItem: FC<Props> = ({ syncedTarget, isOpened, isSelected, onSelect, error, selectOnly = false }) => {
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
