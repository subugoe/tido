import React, { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'

import { createNewPanel, setNewActiveContentType } from '@/utils/panel.ts'
import { waitForElementInDom } from '@/utils/dom.ts'

import Content from '@/components/panel/annotations/popover/cross-ref/Content.tsx'
import Loading from '@/components/ui/loading.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { addCrossReferencedElStyle } from '@/utils/text.ts'

interface Props {
  crossRefInfo: CrossRefInfo,
  error: CustomError,
  loading: boolean,
  onSelect: () => void,
}

const CrossRefLink: FC<Props> = ({ crossRefInfo, error, loading, onSelect }) => {

  const { panelViews: panelViewsConfig } = useConfig()
  const { updatePanel, panelId, usePanelTranslation, panelState } = usePanel()
  const { t } = usePanelTranslation()
  const isDifferentItem = crossRefInfo?.item !== panelState.item?.id

  function openInThisPanel(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onSelect()
    navigate(crossRefInfo, 'update', panelId)
  }

  function openInNewPanel(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onSelect()
    navigate(crossRefInfo, 'new', panelId)
  }

  async function navigate(crossRefInfo: CrossRefInfo, action: string, panelId?: string) {
    let newPanelId = panelId
    const contentType = crossRefInfo?.contentType

    // We need to open that content which contains the cross ref target. Since a panel can have multiple views,
    // we need to find out which view is able to display the content type. Because panel views can be configured freely,
    // we cannot know which view is meant exactly. So we just take the first found.
    const firstViewIndex = panelState.panelViews.findIndex(view => view.contentTypes?.includes(contentType))

    try {
      const refManifest = await useDataStore.getState().initManifest(crossRefInfo.manifest)
      const refItem = await useDataStore.getState().initItem(crossRefInfo.item)

      if (action === 'new') {
        newPanelId = crypto.randomUUID()
        await createNewPanel(
          crossRefInfo.collection,
          refManifest,
          refItem,
          setNewActiveContentType(contentType, firstViewIndex, panelViewsConfig),
          newPanelId,
          !!crossRefInfo.selectedAnnotation
        )
      } else if (action === 'update') {
        updatePanel({
          config: {
            collection: crossRefInfo.collection,
            manifest: crossRefInfo.manifest,
            item: crossRefInfo.item,
            views: setNewActiveContentType(contentType, firstViewIndex, panelState.panelViews),
          },
          showSidebar: !!crossRefInfo.selectedAnnotation,
        })
      }

      const scrollArea = Object.hasOwn(crossRefInfo, 'selectedAnnotation') ? 'sidebar' : 'text'
      const refSelector = scrollArea === 'text' ? crossRefInfo.selector : `[data-annotation="${crossRefInfo.selectedAnnotation.annotation.id}"]`

      waitForElementInDom(`#${newPanelId}`, refSelector, (panelEl: Element) => {
        // use setTimeout to create a small delay before actually scrolling to target
        setTimeout(() => {
          const refEl = panelEl.querySelector(refSelector) as HTMLElement
          addCrossReferencedElStyle(refEl)
          // Selecting the annotation already scrolls its card into view and then aligns the text to
          // it, so scrolling here as well would race that alignment.
          if (scrollArea === 'sidebar') usePanelStore.getState().updatePanel(newPanelId, { selectedAnnotation: crossRefInfo.selectedAnnotation })
          else refEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 700)
      })
    } catch (e) {
      console.error(e)
    }
  }


  return <div className="text-wrap rounded-lg relative">
    <Content
      error={error}
      itemLabel={crossRefInfo?.itemLabel}
      manifestLabel={crossRefInfo?.manifestLabel}
      contentType={crossRefInfo?.contentType}
      actionLabelThisPanel={isDifferentItem ? t('open_in_this_panel') : t('jump_to')}
      actionNewPanel={openInNewPanel}
      actionThisPanel={openInThisPanel}
    />
    {loading && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading />
    </div>}
  </div>
}

export default CrossRefLink
