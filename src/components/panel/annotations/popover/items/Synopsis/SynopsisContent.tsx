import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { SyncedTargetRef, SynopsisConnection } from '@/store/SynopsisStore.tsx'
import WitnessesArea from '@/components/panel/annotations/popover/items/Synopsis/WitnessesArea.tsx'
import WitnessItem from '@/components/panel/annotations/popover/items/Synopsis/WitnessItem.tsx'

interface Props {
  syncTargets: SynopsisConnection
  allWitnessesOpened: boolean
  onOpenSyncedPanels: (selectedTargets: SyncedTargetRef[], replacePanels: boolean) => void
  onSelectTarget: (target: SyncedTargetRef) => void
}

const SynopsisContent: FC<Props> = ({ syncTargets, allWitnessesOpened, onOpenSyncedPanels, onSelectTarget }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const [selectedTargets, setSelectedTargets] = useState<SyncedTargetRef[]>([])
  const [replacePanels, setReplacePanels] = useState(false)

  // All witnesses already loaded in the current panel — show simple select buttons.
  if (allWitnessesOpened) {
    return (
      <div className="flex flex-col gap-2 w-[360px]">
        {syncTargets.otherSyncedTargets.map((st) => (
          <WitnessItem
            key={st.source.id}
            syncedTarget={st}
            isOpened={true}
            isSelected={false}
            onSelect={() => onSelectTarget(st)}
            selectOnly
          />
        ))}
      </div>
    )
  }

  // At least one witness is not loaded — show the full selection UI.
  return (
    <div className="flex flex-col gap-4 w-[360px]">
      <WitnessesArea syncTargets={syncTargets} onSelect={setSelectedTargets} />

      {/* replace-panels toggle + hint shown only when checked */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={replacePanels} onCheckedChange={(checked) => setReplacePanels(checked === true)} />
          {t('replace_panels')}
        </label>
        {replacePanels && (
          <p className="text-sm text-muted-foreground pl-6">{t('replace_panels_hint')}</p>
        )}
      </div>

      <Button
        data-cy="open-synced-panels"
        disabled={selectedTargets.length === 0}
        onClick={() => onOpenSyncedPanels(selectedTargets, replacePanels)}
        className="w-full h-auto py-2 justify-center text-sm disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
      >
        {t('open_synced_panels')}
        {selectedTargets.length > 0 && ` (${selectedTargets.length})`}
      </Button>
    </div>
  )
}

export default SynopsisContent
