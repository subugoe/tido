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

// maps a witness' source content id (source.id) to a boolean (opened / selected)
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


  // Determine which witnesses are opened: a witness counts as open when its source item is loaded
  // in some panel AND that panel has a currently visible text view showing the source content
  // (source.id). Keyed by source.id. On mount both maps are identical (opened witnesses preselected).
  useEffect(() => {
    const panels = usePanelStore.getState().panels

    const opened: WitnessMap = {}
    targets.forEach((ref) => {
      const { source } = ref

      // find a panel that has the source item loaded
      const panel = source.item ? panels.find((p) => p.item?.id === source.item) : undefined

      // among that panel's currently visible views, is there a text view showing text with content url source.id?
      opened[source.id] = !!panel?.panelViews.some((view) => {
        if (view.view !== 'text' || (view.visible ?? true) === false || !view.activeContentType) return false
        const content = panel.item?.contents.find((c) => c.contentType.includes(view.activeContentType!))
        return content?.id === source.id
      })
    })

    setOpenedWitnesses(opened)
    setSelectedWitnesses({ ...opened })
  }, [])


  function toggleWitness(syncedTarget: SyncedTargetRef) {
    const id = syncedTarget.source.id
    if (!id) return
    applySelection({ ...selectedWitnesses, [id]: !selectedWitnesses[id] })
  }

  function toggleAll(selectedWitnesses: WitnessMap, allSelected: boolean) {
    const newSelectedWitnesses: WitnessMap = {}
    Object.keys(selectedWitnesses).forEach((id) => {
      newSelectedWitnesses[id] = !allSelected
    })
    applySelection(newSelectedWitnesses)
  }

  function applySelection(newSelectedWitnesses: WitnessMap) {
    setSelectedWitnesses(newSelectedWitnesses)
    onSelect(targets.filter((st) => newSelectedWitnesses[st.source.id]))
  }

  if (total === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* title + badge */}
      <div className="flex items-center gap-2">
        <h3 data-cy="synoptical-witnesses-title" className="text-sm font-semibold">{t('synoptical_witnesses')}</h3>
        <Badge data-cy="synoptical-witnesses-counter" variant="accent" className="font-semibold">{selectedCount}/{total}</Badge>
      </div>

      {/* select-all checkbox + gray count label */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={allChecked} onCheckedChange={() => toggleAll(selectedWitnesses, allSelected)} />
          {t('select_all')}
        </label>
      </div>

      {/* scrollable list of witnesses */}
      <div data-cy="witness-list" className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
        {targets.map((st) => (
          <WitnessItem
            key={st.source.id}
            syncedTarget={st}
            isOpened={!!openedWitnesses[st.source.id]}
            isSelected={!!selectedWitnesses[st.source.id]}
            onSelect={() => toggleWitness(st)}
          />
        ))}
      </div>
    </div>
  )
}

export default WitnessesArea
