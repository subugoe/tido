import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'
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

  // short siglum (last segment of the manifest id) and full label (titles[0]) of the witness manifest
  const [chip, setChip] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    async function loadWitness() {
      if (!syncedTarget.source.manifest) return
      const manifest = await apiRequest<Manifest>(syncedTarget.source.manifest)
      setChip(manifest.id.split('/').filter(Boolean).pop() ?? '')
      setLabel(manifest.titles?.[0] ?? t('unknown_witness'))
    }

    loadWitness()
  }, [])

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 w-full rounded-md border px-3 py-2.5 text-left transition-colors cursor-pointer',
        isSelected
          ? 'bg-primary/5 border-primary/40 hover:bg-primary/10'
          : 'border-border hover:bg-muted'
      )}
    >
      <Checkbox checked={isSelected} tabIndex={-1} className="pointer-events-none" />
      <Badge variant="accent" className="min-w-9 justify-center font-semibold">{chip}</Badge>
      <span className="flex-1 truncate text-sm">{label}</span>
      {isOpened && (
        <Badge className="border-transparent bg-green-100 text-green-700 font-semibold dark:bg-green-900/30 dark:text-green-400">
          {t('witness_open')}
        </Badge>
      )}
    </button>
  )
}

export default WitnessItem
