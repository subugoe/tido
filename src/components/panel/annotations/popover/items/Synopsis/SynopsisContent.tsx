import { FC, useMemo, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { SyncedTargetRef, SyncedTargetsMap, SynopsisConnection } from '@/store/SynopsisStore.tsx'
import WitnessesArea from '@/components/panel/annotations/popover/items/Synopsis/WitnessesArea.tsx'
import WitnessItem from '@/components/panel/annotations/popover/items/Synopsis/WitnessItem.tsx'
import ConnectionGroup from '@/components/panel/annotations/popover/items/Synopsis/ConnectionGroup.tsx'
import useWitnessErrors from '@/components/panel/annotations/popover/items/Synopsis/useWitnessErrors.ts'
import { flattenSyncedTargets, groupConnectionsByWitness } from '@/utils/annotations.ts'

interface Props {
  syncTargets: SynopsisConnection
  allWitnessesOpened: boolean
  onOpenSyncedPanels: (selectedTargets: SyncedTargetsMap, replacePanels: boolean) => void
  // all valid synced targets of the witness selected in the given sync connection
  onSelectTarget: (connectionKey: string, targets: SyncedTargetRef[]) => void
}

const SynopsisContent: FC<Props> = ({ syncTargets, allWitnessesOpened, onOpenSyncedPanels, onSelectTarget }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const [selectedTargets, setSelectedTargets] = useState<SyncedTargetsMap>({})
  const selectedCount = useMemo(() => flattenSyncedTargets(selectedTargets).length, [selectedTargets])
  const allTargets = useMemo(() => flattenSyncedTargets(syncTargets.otherSyncedTargets), [syncTargets.otherSyncedTargets])
  const [replacePanels, setReplacePanels] = useState(false)

  // hooks can't be called conditionally: validate only when the select buttons are shown,
  // otherwise WitnessesArea validates its own list
  const { errors, isPending } = useWitnessErrors(allWitnessesOpened ? allTargets : [])
  // per sync connection, one button per witness (manifest) for its valid targets and one for its invalid targets
  const connections = useMemo(
    () => groupConnectionsByWitness(syncTargets.otherSyncedTargets, errors),
    [syncTargets.otherSyncedTargets, errors]
  )

  // All witnesses already loaded in the current panel — show simple select buttons.
  if (allWitnessesOpened) {
    return (
      <div className="flex flex-col gap-3 w-[360px]">
        <h3 data-cy="synoptical-witnesses-title" className="text-sm font-semibold">{t('synoptical_witnesses')}</h3>
        <div data-cy="synoptical-connections" className="flex flex-col gap-3">
          {connections.map((connection, i) => (
            <ConnectionGroup key={connection.key} number={i + 1}>
              {connection.witnesses.map((witness) => (
                <WitnessItem
                  key={witness.key}
                  syncedTarget={{ syncTarget: witness.targets[0], count: witness.targets.length }}
                  isOpened={true}
                  isSelected={false}
                  error={witness.error}
                  pending={isPending(witness.targets)}
                  onSelect={() => onSelectTarget(connection.key, witness.targets)}
                  selectOnly
                />
              ))}
            </ConnectionGroup>
          ))}
        </div>
      </div>
    )
  }

  // At least one witness is not loaded — show the full selection UI.
  return (
    <div className="flex flex-col gap-4 w-[380px]">
      <WitnessesArea syncTargets={syncTargets} onSelect={setSelectedTargets} />

      {/* replace-panels toggle + hint shown only when checked */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={replacePanels} onCheckedChange={(checked) => setReplacePanels(checked === true)} />
          {t('replace_panels')}
        </label>
        {replacePanels && (
          <p className="text-xs text-muted-foreground pl-6">{t('replace_panels_hint')}</p>
        )}
      </div>

      <Button
        data-cy="open-synced-panels"
        disabled={selectedCount === 0}
        onClick={() => onOpenSyncedPanels(selectedTargets, replacePanels)}
        className="w-full h-auto py-2 justify-center text-sm disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
      >
        {t('open_synced_panels')}
        {selectedCount > 0 && ` (${selectedCount})`}
      </Button>
    </div>
  )
}

export default SynopsisContent
