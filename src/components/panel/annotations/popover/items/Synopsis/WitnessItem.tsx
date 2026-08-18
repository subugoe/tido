import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { cn } from '@/lib/utils'
import { SyncedTargetRef } from '@/store/SynopsisStore.tsx'

interface Props {
  syncedTarget: SyncedTargetRef
  isOpened: boolean
  isSelected: boolean
  onSelect: () => void
}

const WitnessItem: FC<Props> = ({ syncedTarget, isOpened, isSelected, onSelect }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const [label, setLabel] = useState('')

  useEffect(() => {
    async function loadWitness() {
      if (!syncedTarget.source.manifest) return
      try {
        const manifest = await useDataStore.getState().initManifest(syncedTarget.source.manifest)
        setLabel(manifest.titles?.[0] ?? t('unknown_witness'))
      } catch {
        setLabel(t('unknown_witness'))
      }
    }

    loadWitness()
  }, [])

  return (
    <button
      type="button"
      data-cy="witness-item"
      {...(isSelected ? { 'data-selected': '' } : {})}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 w-full rounded-md border px-3 py-2.5 text-left transition-colors cursor-pointer',
        isSelected
          ? 'bg-primary/5 border-primary/40 hover:bg-primary/10'
          : 'border-border hover:bg-muted'
      )}
    >
      <Checkbox checked={isSelected} tabIndex={-1} className="pointer-events-none" />
      <span data-cy="witness-label" className="flex-1 truncate text-sm">{label}</span>
      {isOpened && (
        <Badge className="border-transparent bg-green-100 text-green-700 font-semibold dark:bg-green-900/30 dark:text-green-400">
          {t('witness_open')}
        </Badge>
      )}
    </button>
  )
}

export default WitnessItem
