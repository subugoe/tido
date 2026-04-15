import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'

import { createNewPanel, setNewActiveContentType } from '@/utils/panel.ts'
import { waitForElementInDom } from '@/utils/dom.ts'

import Content from '@/components/panel/CrossRef/Content'
import Loading from '@/components/ui/loading.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'

interface Props {
  crossRefInfo: CrossRefInfo,
  error: CustomError,
  loading: boolean,
  onSelect: () => void,
}

const CrossRefDifferentItem: FC<Props> = ({ crossRefInfo, error, loading, onSelect }) => {

  const { panelViews: panelViewsConfig } = useConfig()
  const { updatePanel, panelId, usePanelTranslation, panelState } = usePanel()

  const { t } = usePanelTranslation()


  function openInThisPanel(e) {
    e.stopPropagation()
    onSelect()
    navigate(crossRefInfo, 'update', panelId)
  }

  function openInNewPanel(e) {
    e.stopPropagation()
    onSelect()
    navigate(crossRefInfo, 'new', panelId)
  }


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

    // TODO: is it possible to have  ids for the target in annotation globally unique in sidebar ?
    const scrollArea = Object.hasOwn(crossRefInfo, 'selectedAnnotation') ? 'sidebar' : 'text'
    const refSelector = scrollArea === 'text' ? crossRefInfo.selector : `[data-annotation="${crossRefInfo.annotationId}"]`

    waitForElementInDom(`#${newPanelId}`, refSelector, (panelEl: Element) => {
      // use setTimeout to create a small delay before actually scrolling to target
      setTimeout(() => {
        const refEl = panelEl.querySelector(refSelector) as HTMLElement
        refEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (scrollArea === 'sidebar')   usePanelStore.getState().updatePanel(newPanelId, { selectedAnnotation: crossRefInfo.selectedAnnotation })
      }, 700)
    })
  }


  return <div className="max-w-sm text-wrap rounded-lg relative overflow-hidden">
    <Content error={error} itemLabel={crossRefInfo?.itemLabel} manifestLabel={crossRefInfo?.manifestLabel} contentType={crossRefInfo?.contentType}
      actionLabelThisPanel={t('open_in_this_panel')}  actionNewPanel={openInNewPanel} actionThisPanel={openInThisPanel}  />
    {loading && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading size={36} />
    </div>}
  </div>
}

export default CrossRefDifferentItem
