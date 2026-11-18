import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { visibleTextSources } from '@/utils/panel-views.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import WitnessItem from '@/components/panel/annotations/popover/items/Synopsis/WitnessItem.tsx'
import { SyncedTargetRef, SynopsisConnection } from '@/store/SynopsisStore.tsx'
import { getTargetKey } from '@/utils/annotations.ts'
import useWitnessErrors from '@/components/panel/annotations/popover/items/Synopsis/useWitnessErrors.ts'

interface Props {
  syncTargets: SynopsisConnection
  onSelect: (selected: SyncedTargetRef[]) => void
}

// maps a synced target (getTargetKey) to a boolean (opened / selected)
type WitnessMap = Record<string, boolean>

const WitnessesArea: FC<Props> = ({ syncTargets, onSelect }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const targets = syncTargets.otherSyncedTargets
  const [openedWitnesses, setOpenedWitnesses] = useState<WitnessMap>({})
  const [selectedWitnesses, setSelectedWitnesses] = useState<WitnessMap>({})
  // witnesses whose text is not part of their item or which don't contain the synced target - can't be selected
  const errors = useWitnessErrors(targets)

  // a witness counts as selected only while it is valid, so one that turns out invalid is deselected
  const validTargets = targets.filter((st) => !errors[getTargetKey(st)])
  const selectedTargets = validTargets.filter((st) => selectedWitnesses[getTargetKey(st)])

  const total = validTargets.length
  const selectedCount = selectedTargets.length
  const allSelected = total > 0 && selectedCount === total
  const allChecked: boolean | 'indeterminate' =
    selectedCount === 0 ? false : allSelected ? true : 'indeterminate'

  // Determine which witnesses are opened: a witness counts as open when its source item is loaded
  // in some panel AND that panel has a currently visible text view showing the source content
  // (source.id). All targets of an opened text count as opened. On mount opened witnesses are preselected.
  useEffect(() => {
    const panels = usePanelStore.getState().panels

    const opened: WitnessMap = {}
    targets.forEach((ref) => {
      const { source } = ref

      // find a panel that has the source item loaded
      const panel = source.item ? panels.find((p) => p.item?.id === source.item) : undefined

      // among that panel's currently visible views, is there a text view showing text with content url source.id?
      opened[getTargetKey(ref)] = !!panel && visibleTextSources(panel).some(s => s.contentUrl === source.id)
    })

    setOpenedWitnesses(opened)
    setSelectedWitnesses(opened)
  }, [])

  // report the selection whenever it changes - also when a selected witness turns out invalid
  const selectedKeys = selectedTargets.map(getTargetKey).join(',')
  useEffect(() => {
    onSelect(selectedTargets)
  }, [selectedKeys])

  function toggleWitness(syncedTarget: SyncedTargetRef) {
    const key = getTargetKey(syncedTarget)
    if (errors[key]) return
    setSelectedWitnesses({ ...selectedWitnesses, [key]: !selectedWitnesses[key] })
  }

  function toggleAll() {
    const newSelectedWitnesses: WitnessMap = {}
    validTargets.forEach((st) => {
      newSelectedWitnesses[getTargetKey(st)] = !allSelected
    })
    setSelectedWitnesses(newSelectedWitnesses)
  }

  if (total === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* title + badge */}
      <div className="flex items-center gap-2">
        <h3 data-cy="synoptical-witnesses-title" className="text-sm font-semibold">{t('synoptical_witnesses')}</h3>
        <Badge data-cy="synoptical-witnesses-counter" variant="muted" className="font-semibold">{selectedCount}/{total}</Badge>
      </div>

      {/* select-all checkbox + gray count label */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
          {t('select_all')}
        </label>
      </div>

      {/* scrollable list of witnesses */}
      <div data-cy="witness-list" className="flex flex-col gap-1.5">
        {targets.map((st) => (
          <WitnessItem
            key={getTargetKey(st)}
            syncedTarget={st}
            isOpened={!!openedWitnesses[getTargetKey(st)]}
            isSelected={!!selectedWitnesses[getTargetKey(st)]}
            error={errors[getTargetKey(st)]}
            onSelect={() => toggleWitness(st)}
          />
        ))}
      </div>
    </div>
  )
}

export default WitnessesArea
