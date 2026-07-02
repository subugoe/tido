import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import WitnessItem from '@/components/panel/annotations/popover/items/Synopsis/WitnessItem.tsx'
import { SyncedTargetRef, SyncTargets } from '@/store/SynopsisStore.tsx'

interface Props {
  syncTargets: SyncTargets
  onSelect: (selected: SyncedTargetRef[]) => void
}

// maps a witness' manifest id to a boolean (opened / selected)
type WitnessMap = Record<string, boolean>

const WitnessesArea: FC<Props> = ({ syncTargets, onSelect }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const targets = syncTargets.targets
  const [openedWitnesses, setOpenedWitnesses] = useState<WitnessMap>({})
  const [selectedWitnesses, setSelectedWitnesses] = useState<WitnessMap>({})

  const total = targets.length
  const selectedCount = Object.values(selectedWitnesses).filter(Boolean).length
  const allSelected = total > 0 && selectedCount === total
  const allChecked: boolean | 'indeterminate' =
    selectedCount === 0 ? false : allSelected ? true : 'indeterminate'


  // Determine which witnesses are opened by matching each source's manifest url against the
  // manifests currently opened in panels, and preselect those. On mount both maps are identical.
  useEffect(() => {
    const panels = usePanelStore.getState().panels
    const openManifestIds = new Set(panels.map((panel) => panel.manifest?.id).filter(Boolean))

    const opened: WitnessMap = {}
    targets.forEach((ref) => {
      if (!ref.source.manifest) return
      opened[ref.source.manifest] = openManifestIds.has(ref.source.manifest)
    })

    setOpenedWitnesses(opened)
    setSelectedWitnesses({ ...opened })
  }, [])


  function toggleWitness(syncedTarget: SyncedTargetRef) {
    const manifest = syncedTarget.source.manifest
    if (!manifest) return
    applySelection({ ...selectedWitnesses, [manifest]: !selectedWitnesses[manifest] })
  }

  function toggleAll(selectedWitnesses: WitnessMap, allSelected: boolean) {
    const newSelectedWitnesses: WitnessMap = {}
    Object.keys(selectedWitnesses).forEach((manifest) => {
      newSelectedWitnesses[manifest] = !allSelected
    })
    applySelection(newSelectedWitnesses)
  }

  function applySelection(newSelectedWitnesses: WitnessMap) {
    setSelectedWitnesses(newSelectedWitnesses)
    onSelect(targets.filter((st) => newSelectedWitnesses[st.source.manifest]))
  }

  if (total === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* title + badge */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{t('synoptical_witnesses')}</h3>
        <Badge variant="accent" className="font-semibold">{selectedCount}/{total}</Badge>
      </div>

      {/* select-all checkbox + gray count label */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={allChecked} onCheckedChange={() => toggleAll(selectedWitnesses, allSelected)} />
          {t('select_all')}
        </label>
        <span className="text-sm text-muted-foreground">
          {t('witnesses_count', { selected: selectedCount, total })}
        </span>
      </div>

      {/* scrollable list of witnesses */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
        {targets.map((st) => (
          <WitnessItem
            key={st.source.id}
            syncedTarget={st}
            isOpened={!!openedWitnesses[st.source.manifest]}
            isSelected={!!selectedWitnesses[st.source.manifest]}
            onSelect={() => toggleWitness(st)}
          />
        ))}
      </div>
    </div>
  )
}

export default WitnessesArea
