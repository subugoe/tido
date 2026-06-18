import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'
import { getContentTypes, splitMIMEType } from '@/utils/panel.ts'
import { Button } from '@/components/ui/button.tsx'
import { Columns2 } from 'lucide-react'
import { PanelConfig, PanelView } from '@/types'
import { SyncedTargetRef } from '@/store/SynopsisStore.tsx'

interface Props {
  syncTargets: SyncedTargetRef[]
}

const SynopsisItem: FC<Props> = ({ syncTargets }) => {
  const { usePanelTranslation, panelId } = usePanel()
  const { t } = usePanelTranslation()

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
    // read the latest panels imperatively so we account for panels opened in between
    const panels = usePanelStore.getState().panels
    const currentPanel = panels.find((panel) => panel.id === panelId)

    syncTargets.forEach((syncTarget) => {
      const { source } = syncTarget
      if (!source.item) return

      // 1) if the source item is the same as the current panel, open it in another (new) panel
      if (currentPanel?.item?.id === source.item) {
        openInNewPanel(source)
        return
      }

      // 2) if the item is already opened in another panel, add a text view to it
      const otherPanel = panels.find((panel) => panel.id !== panelId && panel.item?.id === source.item)
      if (otherPanel) {
        usePanelStore.getState().updatePanel(otherPanel.id, {
          panelViews: [...otherPanel.panelViews, buildSyncedTextView(otherPanel, source)]
        })
        return
      }

      // 3) otherwise open a new panel for the synced source
      openInNewPanel(source)
    })
  }

  function openInNewPanel(source: AnnotationTargetSource) {
    // a new panel needs at least a collection
    if (!source.collection) return

    const newPanelConfig: PanelConfig = {
      collection: source.collection,
      manifest: source.manifest,
      item: source.item
    }

    const newPanelId = crypto.randomUUID()
    useUIStore.getState().updateNewestPanelId(newPanelId)
    usePanelStore.getState().addPanel(newPanelConfig, newPanelId)
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        variant="outline"
        className="justify-start"
        onClick={openSyncedPanels}
      >
        <Columns2 /> {t('open_synced_panels')}
      </Button>
    </div>
  )
}

export default SynopsisItem
