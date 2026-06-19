import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { createNewPanel, getContentTypes, setNewActiveContentType, splitMIMEType } from '@/utils/panel.ts'
import { Button } from '@/components/ui/button.tsx'
import { Columns2 } from 'lucide-react'
import { PanelView } from '@/types'
import { SyncTargets, useSynopsisStore } from '@/store/SynopsisStore.tsx'

interface Props {
  syncTargets: SyncTargets,
  onSelect: () => void
}

const SynopsisItem: FC<Props> = ({ syncTargets, onSelect }) => {
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()
  const { panelViews: panelViewsConfig } = useConfig()
  const setSyncedTargets = useSynopsisStore((state) => state.setSyncedTargets)

  function onClick() {
    onSelect()
    openSyncedPanels()
    // store the synced targets so each panel can highlight and scroll to its own target
    setSyncedTargets(syncTargets)
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

  function openSyncedPanels() {
    // Idea
    // - Case 1 — source item is in the current panel, or not open in any other panel → openInNewPanel(source).
    // - Case 2 — source item is already open in another panel:
    //     - 2a) it's missing → append the synced text view.
    //     - 2b) that panel already shows a text view for source.id → do nothing.

    const panels = usePanelStore.getState().panels
    const currentPanel = panels.find((panel) => panel.id === panelId)

    syncTargets.targets.forEach((syncTarget) => {
      const { source } = syncTarget
      if (!source.item) return

      // check if any other opened panel includes the source.item
      const otherPanel = panels.find((panel) => panel.id !== panelId && panel.item?.id === source.item)

      // 1) source.item is in the current panel, or is not open in any other panel -> open a new panel
      if (currentPanel?.item?.id === source.item || !otherPanel) {
        openInNewPanel(source)
        return
      }

      // 2) source.item is already opened in another panel
      // 2b) it already shows the text view for source.id -> do nothing
      if (panelShowsSource(otherPanel, source)) return

      // 2a) it misses the text view for source.id -> add one
      usePanelStore.getState().updatePanel(otherPanel.id, {
        panelViews: [...otherPanel.panelViews, buildSyncedTextView(otherPanel, source)]
      })
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
    const textViewIndex = panelViewsConfig.findIndex((view: PanelView) => view.view === 'text')

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
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        variant="outline"
        className="justify-start"
        onClick={onClick}
      >
        <Columns2 /> {t('open_synced_panels')}
      </Button>
    </div>
  )
}

export default SynopsisItem
