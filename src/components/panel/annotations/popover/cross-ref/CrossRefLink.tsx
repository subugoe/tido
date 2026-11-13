import React, { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError, logError } from '@/utils/custom-error.ts'

import { createNewPanel } from '@/utils/panel.ts'
import { configureViews, findContentByType, getContentTypes, resolveViews, showContent, viewsShowingContent } from '@/utils/panel-views.ts'
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

  const config = useConfig()
  const { updatePanel, panelId, usePanelTranslation, panelState } = usePanel()
  const { t } = usePanelTranslation()
  const isDifferentItem = crossRefInfo?.item !== panelState.item?.id
  // the referenced content type is only worth naming when the referenced item has more than one
  const namesContentType = !!crossRefInfo?.contentType && getContentTypes(crossRefInfo.refItemData?.contents ?? []).length > 1

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

    // The panel shows the content that contains the cross ref target (see showContent): the referenced item
    // is resolved with the views of the panel first, so that content is looked for among them.

    try {
      const refManifest = await useDataStore.getState().initManifest(crossRefInfo.manifest)
      const refItem = await useDataStore.getState().initItem(crossRefInfo.item)

      const contentUrl = findContentByType(refItem.contents, contentType)?.id

      if (action === 'new') {
        newPanelId = crypto.randomUUID()
        await createNewPanel(crossRefInfo.collection, refManifest, refItem, newPanelId, {
          showSidebar: !!crossRefInfo.selectedAnnotation,
          views: viewsShowingContent(configureViews(config), refItem, contentUrl),
        })
      } else if (action === 'update') {
        // The panel config stays as it is, the panel only goes to the referenced item and shows its content
        const views = resolveViews({ ...configureViews(config, panelState.config), item: refItem, previous: panelState.panelViews })
        updatePanel({
          config: {
            ...panelState.config,
            collection: crossRefInfo.collection,
            manifest: crossRefInfo.manifest,
            item: crossRefInfo.item,
            selectedAnnotationId: null,
          },
          panelViews: contentUrl ? showContent(views, refItem, contentUrl) : views,
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
      logError(e, t)
    }
  }


  return <div className="text-wrap rounded-lg relative">
    <Content
      error={error}
      itemLabel={crossRefInfo?.itemLabel}
      manifestLabel={crossRefInfo?.manifestLabel}
      contentType={namesContentType ? crossRefInfo.contentType : undefined}
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
