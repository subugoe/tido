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

  // Whether the panel already has a text view showing the synced content (source.id).
  function panelShowsSource(panel: PanelState, source: AnnotationTargetSource): boolean {
    return panel.panelViews.some((view) => {
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
    // - Case 1 — the source content url (source.id) is already shown in a panel → do nothing.
    // - Case 2 — the source item is open in another panel (but not this content) → append the synced text view.
    // - Case 3 — the source content is not open anywhere → openInNewPanel(source).

    const panels = usePanelStore.getState().panels

    selectedTargets.forEach((syncTarget) => {
      const { source } = syncTarget
      if (!source.item) return

      // 1) the source content url (source.id) is already shown in a panel -> nothing to do
      if (panels.some((panel) => panelShowsSource(panel, source))) return

      // 2) the source item is open in another panel (but not this content) -> append the synced text view
      const otherPanel = panels.find((panel) => panel.id !== panelId && panel.item?.id === source.item)
      if (otherPanel) {
        usePanelStore.getState().updatePanel(otherPanel.id, {
          panelViews: [...otherPanel.panelViews, buildSyncedTextView(otherPanel, source)]
        })
        return
      }

      // 3) the source content is not open anywhere -> open a new panel
      openInNewPanel(source)
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
