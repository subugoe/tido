import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { createNewPanel, getContentTypes, setNewActiveContentType, splitMIMEType } from '@/utils/panel.ts'
import { PanelView } from '@/types'
import { SyncedTargetRef, SyncTargets, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import SynopsisContent from '@/components/panel/annotations/popover/items/Synopsis/SynopsisContent.tsx'

interface Props {
  syncTargets: SyncTargets,
  onSelect: () => void
}

const SynopsisContainer: FC<Props> = ({ syncTargets, onSelect }) => {
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()
  const { panelViews: panelViewsConfig } = useConfig()
  const setActiveSyncedTargets = useSynopsisStore((state) => state.setActiveSyncedTargets)

  function onOpenPanelsClick(selectedTargets: SyncedTargetRef[], replacePanels: boolean) {
    onSelect()
    if (replacePanels) openWithSubstitute(selectedTargets)
    else openAdditionalPanel(selectedTargets)
    // store the synced targets so each panel can highlight and scroll to its own target
    setActiveSyncedTargets({ ...syncTargets, targets: selectedTargets })
  }

  // The index of the panel's text view showing the synced content (source.id), or -1 when the panel
  // has no view for it. A view found here may still be hidden.
  function findSyncedTextViewIndex(panel: PanelState, source: AnnotationTargetSource): number {
    return panel.panelViews.findIndex((view) => {
      if (view.view !== 'text' || !view.activeContentType) return false
      const content = panel.item?.contents.find((c) => c.contentType.includes(view.activeContentType))
      return content?.id === source.id
    })
  }

  // Build a text view that displays the synced content of the given panel's item.
  function buildSyncedTextView(panel: PanelState, source: AnnotationTargetSource): PanelView {
    const contentTypes = panel.item ? getContentTypes(panel.item.contents) : []
    const content = panel.item?.contents?.find((c) => c.id === source.id)
    const [, activeContentType] = content ? splitMIMEType(content.contentType) : []

    return {
      view: 'text',
      label: activeContentType ?? t('text'),
      contentTypes,
      activeContentType: activeContentType ?? contentTypes[0],
      visible: true
    }
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
    // Idea
    // - Case 1 — the source item is not open in any panel → openInNewPanel(source).
    // - Case 2 — its panel already has a view for the source content url (source.id) → show that view.
    // - Case 3 — its panel has no view for that content → append the synced text view.
    // Cases 2 and 3 differ only in the views they hand to the panel, so both end in the same update.

    const panels = usePanelStore.getState().panels

    selectedTargets.forEach((syncTarget) => {
      const { source } = syncTarget
      if (!source.item) return

      // 1) the panel the source item is open in - without one there is nothing to update
      const panel = panels.find((panel) => panel.item?.id === source.item)
      if (!panel) {
        openInNewPanel(source)
        return
      }

      const syncedViewIndex = findSyncedTextViewIndex(panel, source)

      const panelViews = syncedViewIndex === -1
        ? [...panel.panelViews, buildSyncedTextView(panel, source)]
        : panel.panelViews.map((view, i) => i === syncedViewIndex ? { ...view, visible: true } : view)

      usePanelStore.getState().updatePanel(panel.id, { panelViews })
    })
  }

  async function openInNewPanel(source: AnnotationTargetSource) {
    // a new panel needs at least a collection, manifest and item
    if (!source.collection || !source.manifest || !source.item) return

    const manifest = await apiRequest<Manifest>(source.manifest)
    const item = await apiRequest<Item>(source.item)

    // find the content type that corresponds to the synced content (source.id), so the new
    // panel opens the text view that shows exactly that content instead of the default one.
    const content = item.contents?.find((c) => c.id === source.id)
    const [, activeContentType] = content ? splitMIMEType(content.contentType) : []
    const textViewIndex = panelViewsConfig.findIndex((view: PanelView) => view.view === 'text' && view.contentTypes.includes(activeContentType))

    const newPanelId = crypto.randomUUID()
    await createNewPanel(
      source.collection,
      manifest,
      item,
      activeContentType ? setNewActiveContentType(activeContentType, textViewIndex, panelViewsConfig) : panelViewsConfig,
      newPanelId
    )
  }

  return (
    <SynopsisContent
      syncTargets={syncTargets}
      onOpenSyncedPanels={onOpenPanelsClick}
    />
  )
}

export default SynopsisContainer
