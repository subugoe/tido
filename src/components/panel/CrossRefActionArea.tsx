import { FC, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { apiRequest } from '@/utils/api.ts'
import { createNewPanel, setNewActiveContentType } from '@/utils/panel.ts'
import { waitForElementInDom } from '@/utils/dom.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { ExternalLink } from 'lucide-react'


interface Props {
  crossRefInfo: CrossRefInfo,
  onSelect: () => void
}

const CrossRefActionArea: FC<Props> = ({ crossRefInfo, onSelect }) => {

  const { panelState, updatePanel, panelId, usePanelTranslation } = usePanel()
  const { panelViews: panelViewsConfig } = useConfig()
  const { t } = usePanelTranslation()


  const crossRefInfoRef = useRef<CrossRefInfo>(null)

  useEffect(() => {
    crossRefInfoRef.current = crossRefInfo
  }, [])


  async function navigate(crossRefInfo: CrossRefInfo, action: string, panelId?: string) {
    let newPanelId = panelId
    const contentType = crossRefInfo.contentType

    // We need to open that content which contains the cross ref target. Since a panel can have multiple views,
    // we need to find out which view is able to display the content type. Because panel views can be configured freely,
    // we cannot know which view is meant exactly. So we just take the first found.
    const firstViewIndex = panelState.panelViews.findIndex(view => view.contentTypes?.includes(contentType))
    const refManifest = await apiRequest<Manifest>(crossRefInfo.manifest)
    const refItem = await apiRequest<Item>(crossRefInfo.item)

    if (action === 'new') {
      newPanelId = crypto.randomUUID()
      await createNewPanel(
        crossRefInfo.collection,
        refManifest,
        refItem,
        setNewActiveContentType(contentType, firstViewIndex, panelViewsConfig),
        newPanelId,
        true
      )
    } else if (action === 'update') {
      updatePanel({
        config: {
          collection: crossRefInfo.collection,
          manifest: crossRefInfo.manifest,
          item: crossRefInfo.item,
          views: setNewActiveContentType(contentType, firstViewIndex, panelState.panelViews),
        },
      })
    }

    waitForElementInDom(`#${newPanelId}`, `[data-annotation="${crossRefInfo.annotationId}"]`, (panelEl: Element) => {
      // use setTimeout to create a small delay before actually scrolling to target
      setTimeout(() => {
        const annotationEl = panelEl.querySelector(`[data-annotation="${crossRefInfo.annotationId}"]`) as HTMLElement
        annotationEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        usePanelStore.getState().updatePanel(newPanelId, { selectedAnnotation: crossRefInfo.selectedAnnotation })
      }, 700)
    })
  }

  function openInThisPanel(e: MouseEvent, crossRefInfo: CrossRefInfo) {
    e.stopPropagation()
    onSelect()
    navigate(crossRefInfo, 'update', panelId)
  }

  function openInNewPanel(e: MouseEvent, crossRefInfo: CrossRefInfo) {
    e.stopPropagation()
    onSelect()
    navigate(crossRefInfo, 'new')
  }


  return (
    <div className="flex-col">
      <div className="mb-2"> {t('reference')}</div>
      <div>
        <Button variant="ghost" className="pl-3 w-[90%]" onClick={(e) => openInThisPanel(e, crossRefInfoRef.current)}>{t('open_in_this_panel')}</Button>
        <Button variant="ghost" className="w-[90%]" onClick={(e) => openInNewPanel(e, crossRefInfoRef.current)}>{t('open_in_new_panel')} <ExternalLink size={16} className="inline" /></Button>
      </div>
    </div>
  )
}

export default CrossRefActionArea
