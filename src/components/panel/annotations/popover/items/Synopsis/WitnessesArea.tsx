import { FC, useEffect, useMemo, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { visibleTextSources } from '@/utils/panel-views.ts'
import { Badge } from '@/components/ui/badge.tsx'
import WitnessItem from '@/components/panel/annotations/popover/items/Synopsis/WitnessItem.tsx'
import ConnectionGroup from '@/components/panel/annotations/popover/items/Synopsis/ConnectionGroup.tsx'
import { SyncedTargetsMap, SynopsisConnection } from '@/store/SynopsisStore.tsx'
import {
  ConnectionEntry,
  flattenSyncedTargets,
  getTargetKey,
  getWitnessKey,
  groupConnectionsByWitness,
  WitnessEntry
} from '@/utils/annotations.ts'
import useWitnessErrors from '@/components/panel/annotations/popover/items/Synopsis/useWitnessErrors.ts'

interface Props {
  syncTargets: SynopsisConnection
  // the valid synced targets of the selected witnesses, per sync connection
  onSelect: (selected: SyncedTargetsMap) => void
}

// maps a witness (getWitnessKey) to whether it is opened in a panel
type WitnessMap = Record<string, boolean>
// maps a witness of a connection (getSelectionKey) to whether it is selected
type SelectionMap = Record<string, boolean>

// A witness is selected per sync connection - the same witness may be part of several of them
function getSelectionKey(connectionKey: string, witnessKey: string): string {
  return `${connectionKey}|${witnessKey}`
}

const WitnessesArea: FC<Props> = ({ syncTargets, onSelect }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const syncedTargets = syncTargets.otherSyncedTargets
  const targets = useMemo(() => flattenSyncedTargets(syncedTargets), [syncedTargets])
  const [openedWitnesses, setOpenedWitnesses] = useState<WitnessMap>({})
  const [selectedWitnesses, setSelectedWitnesses] = useState<SelectionMap>({})
  // synced targets whose text is not part of their item or which aren't found in their text
  const errors = useWitnessErrors(targets)
  // per sync connection, one entry per witness (manifest) for its valid targets and one for its invalid targets
  const connections = useMemo(() => groupConnectionsByWitness(syncedTargets, errors), [syncedTargets, errors])

  const validWitnesses = (connection: ConnectionEntry) => connection.witnesses.filter((witness) => !witness.error)
  const isSelected = (connection: ConnectionEntry, witness: WitnessEntry) =>
    !witness.error && !!selectedWitnesses[getSelectionKey(connection.key, witness.key)]

  // a selected witness contributes all of its valid synced targets to its connection
  const selectedTargets: SyncedTargetsMap = {}
  connections.forEach((connection) => {
    const connectionTargets = connection.witnesses
      .filter((witness) => isSelected(connection, witness))
      .flatMap((witness) => witness.targets)
    if (connectionTargets.length > 0) selectedTargets[connection.key] = connectionTargets
  })

  const total = connections.reduce((sum, connection) => sum + validWitnesses(connection).length, 0)
  const selectedCount = connections.reduce((sum, connection) =>
    sum + connection.witnesses.filter((witness) => isSelected(connection, witness)).length, 0)

  // Determine which witnesses are opened: a synced target counts as open when its source item is loaded
  // in some panel AND that panel has a currently visible text view showing the source content
  // (source.id). A witness is opened when one of its targets is. On mount opened witnesses are
  // preselected in every connection they are part of.
  useEffect(() => {
    const panels = usePanelStore.getState().panels

    const opened: WitnessMap = {}
    targets.forEach((st) => {
      const { source } = st

      // find a panel that has the source item loaded
      const panel = source.item ? panels.find((p) => p.item?.id === source.item) : undefined

      // among that panel's currently visible views, is there a text view showing text with content url source.id?
      const isOpened = !!panel && visibleTextSources(panel).some(s => s.contentUrl === source.id)
      const key = getWitnessKey(st)
      opened[key] = opened[key] || isOpened
    })

    const selected: SelectionMap = {}
    Object.entries(syncedTargets).forEach(([connectionKey, connectionTargets]) => connectionTargets.forEach((st) => {
      const witnessKey = getWitnessKey(st)
      if (opened[witnessKey]) selected[getSelectionKey(connectionKey, witnessKey)] = true
    }))

    setOpenedWitnesses(opened)
    setSelectedWitnesses(selected)
  }, [])

  // report the selection whenever it changes - also when a selected target turns out invalid
  const selectedKeys = Object.entries(selectedTargets)
    .map(([connectionKey, connectionTargets]) => `${connectionKey}:${connectionTargets.map(getTargetKey).join(',')}`)
    .join(';')
  useEffect(() => {
    onSelect(selectedTargets)
  }, [selectedKeys])

  function toggleWitness(connection: ConnectionEntry, witness: WitnessEntry) {
    if (witness.error) return
    const key = getSelectionKey(connection.key, witness.key)
    setSelectedWitnesses({ ...selectedWitnesses, [key]: !selectedWitnesses[key] })
  }

  function getAllChecked(connection: ConnectionEntry): boolean | 'indeterminate' {
    const valid = validWitnesses(connection)
    const selected = valid.filter((witness) => isSelected(connection, witness)).length
    if (selected === 0) return false
    return selected === valid.length ? true : 'indeterminate'
  }

  // selects all valid witnesses of the connection - or unselects them when all are selected already
  function toggleAll(connection: ConnectionEntry) {
    const select = getAllChecked(connection) !== true
    const newSelectedWitnesses = { ...selectedWitnesses }
    validWitnesses(connection).forEach((witness) => {
      newSelectedWitnesses[getSelectionKey(connection.key, witness.key)] = select
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

      {/* one group per sync connection, each with its own "select all" */}
      <div data-cy="synoptical-connections" className="flex flex-col gap-3">
        {connections.map((connection, i) => (
          <ConnectionGroup
            key={connection.key}
            number={i + 1}
            selectAll={{
              checked: getAllChecked(connection),
              disabled: validWitnesses(connection).length === 0,
              onToggle: () => toggleAll(connection)
            }}
          >
            {connection.witnesses.map((witness) => (
              <WitnessItem
                key={witness.key}
                syncedTarget={{ syncTarget: witness.targets[0], count: witness.targets.length }}
                isOpened={!!openedWitnesses[getWitnessKey(witness.targets[0])]}
                isSelected={isSelected(connection, witness)}
                error={witness.error}
                onSelect={() => toggleWitness(connection, witness)}
              />
            ))}
          </ConnectionGroup>
        ))}
      </div>
    </div>
  )
}

export default WitnessesArea
