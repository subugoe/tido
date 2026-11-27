import { FC, useMemo } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { createNewPanel } from '@/utils/panel.ts'
import { configureViews, showContent, viewsShowingContent, visibleTextSources } from '@/utils/panel-views.ts'
import { useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { flattenSyncedTargets } from '@/utils/annotations.ts'
import SynopsisContent from '@/components/panel/views/annotations/popover/items/Synopsis/SynopsisContent.tsx'
import { logError } from '@/utils/custom-error.ts'

interface Props {
  syncTargets: SynopsisConnection,
  onSelect: () => void
}

// Whether a synced target's source content is loaded in a panel AND visible via a text view.
function isWitnessOpened(source: AnnotationTargetSource, panels: PanelState[]): boolean {
  const panel = source.item ? panels.find((p) => p.item?.id === source.item) : undefined
  return !!panel && visibleTextSources(panel).some(s => s.contentUrl === source.id)
}

const SynopsisContainer: FC<Props> = ({ syncTargets, onSelect }) => {
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()
  const config = useConfig()

  const targets = useMemo(() => flattenSyncedTargets(syncTargets.otherSyncedTargets), [syncTargets.otherSyncedTargets])

  const allWitnessesOpened = useMemo(() => {
    if (targets.length === 0) return false
    const panels = usePanelStore.getState().panels
    return targets.every((st) => isWitnessOpened(st.source, panels))
  }, [targets])

  // the valid synced targets of the witness selected in the given sync connection
  function onSelectTarget(connectionKey: string, targets: SyncedTargetRef[]) {
    onSelect()
    useSynopsisStore.getState().setActiveSynopsisConnection({ ...syncTargets, otherSyncedTargets: { [connectionKey]: targets } })
  }

  function onOpenPanelsClick(selectedTargets: SyncedTargetsMap, replacePanels: boolean) {
    onSelect()
    // a text is opened once, even when several selected targets - of one or several connections - live in it
    const textTargets = [...new Map(flattenSyncedTargets(selectedTargets).map((st) => [st.source.id, st])).values()]
    if (replacePanels) openWithSubstitute(textTargets)
    else openAdditionalPanel(textTargets)
    useSynopsisStore.getState().setActiveSynopsisConnection({ ...syncTargets, otherSyncedTargets: selectedTargets })
  }

  // Replace the existing panels (except the current one) with a fresh panel per selected witness.
  function openWithSubstitute(selectedTargets: SyncedTargetRef[]) {
    // remove all panels except the current one so new ones open to its right
    const panels = usePanelStore.getState().panels
    panels.forEach((panel) => {
      if (panel.id !== panelId) usePanelStore.getState().removePanel(panel.id)
    })

    selectedTargets.forEach((syncTarget) => {
      const { source } = syncTarget
      if (!source.item) return

      openInNewPanel(source)
    })
  }

  function openAdditionalPanel(selectedTargets: SyncedTargetRef[]) {
    // The source item is opened in a new panel when no panel shows it - otherwise its panel shows the
    // source content (see showContent).

    const panels = usePanelStore.getState().panels

    selectedTargets.forEach((syncTarget) => {
      const { source } = syncTarget
      if (!source.item) return

      const panel = panels.find((panel) => panel.item?.id === source.item)
      if (!panel) {
        openInNewPanel(source)
        return
      }

      usePanelStore.getState().updatePanel(panel.id, { panelViews: showContent(panel.panelViews, panel.item, source.id) })
    })
  }

  async function openInNewPanel(source: AnnotationTargetSource) {
    // a new panel needs at least a collection, manifest and item
    if (!source.collection || !source.manifest || !source.item) return

    try {
      const manifest = await useDataStore.getState().initManifest(source.manifest)
      const item = await useDataStore.getState().initItem(source.item)

      // the new panel shows exactly the synced content (source.id) instead of its default one
      const views = viewsShowingContent(configureViews(config), item, source.id)
      await createNewPanel(source.collection, manifest, item, crypto.randomUUID(), { views })
    } catch (e) {
      logError(e, t)
    }
  }

  return (
    <SynopsisContent
      syncTargets={syncTargets}
      allWitnessesOpened={allWitnessesOpened}
      onOpenSyncedPanels={onOpenPanelsClick}
      onSelectTarget={onSelectTarget}
    />
  )
}

export default SynopsisContainer
