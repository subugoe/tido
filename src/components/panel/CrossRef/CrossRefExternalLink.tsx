import { ComponentPropsWithoutRef, ElementType, FC } from 'react'

import { useUIStore } from '@/store/UIStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes } from '@/utils/panel.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { waitForElementInDom } from '@/utils/other-functions.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { ExternalLink } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'


type GenericElementProps<T extends ElementType> = {
  props?: ComponentPropsWithoutRef<T>
  node: HTMLElement
} & ComponentPropsWithoutRef<T>

const CrossRefExternalLink: FC<GenericElementProps<T>> = ({ props, node }) => {

  const { updatePanel, panelId, panelState, usePanelTranslation } = usePanel()

  const isTargetInDiffItem = node.getAttribute('data-ref-item') !== panelState.item?.id
  const { t } = usePanelTranslation()



  async function scrollToDifferentItem(sourceEl: HTMLElement, action: string, panelId: string) {

    let newPanelId = panelId
    const collectionId = sourceEl.getAttribute('data-ref-collection')
    const manifestId = sourceEl.getAttribute('data-ref-manifest')
    const itemId = sourceEl.getAttribute('data-ref-item')
    const contentType = sourceEl.getAttribute('data-ref-content-type')
    const selector = sourceEl.getAttribute('data-ref-target')

    const collection = await useDataStore.getState().initCollection(collectionId)
    const manifestIndex = collection.sequence.findIndex(m => m.id === manifestId)
    const manifest = await apiRequest<Manifest>(collection.sequence[manifestIndex].id)
    const itemIndex = manifest.sequence.findIndex(i => i.id === itemId)
    const item = await apiRequest<Item>(itemId)
    const newContentTypes = getContentTypes(item.content)
    const newContentIndex = newContentTypes.findIndex(type => type === contentType)

    if (action === 'new') {
      const newPanelConfig = {
        collection: collectionId,
        manifestIndex,
        itemIndex,
        contentIndex: newContentIndex
      }

      newPanelId = crypto.randomUUID()
      useUIStore.getState().updateNewestPanelId(newPanelId)
      await usePanelStore.getState().addPanel(newPanelConfig, newPanelId)
    }

    updatePanel({
      collectionId,
      manifest: manifest,
      item,
      contentIndex: newContentIndex
    })

    // use setTimeout to create a small delay after update or creating a new panel
    setTimeout(async () => {
      waitForElementInDom('#' + newPanelId, (panelEl: HTMLElement) => {
        const targetEl = panelEl.querySelector(selector) as HTMLElement
        targetEl.scrollIntoView({ behavior: 'smooth' })
      })
    }, 500)
  }

  const link = <a
    className={
      (props.className || '') +
        ' text-blue-600 underline cursor-pointer'
    }
  >
    {node.innerHTML}
    {isTargetInDiffItem ? <ExternalLink size={16} className="inline ml-[1px]" /> : ''}
  </a>


  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {link}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" className="p-2 cursor-pointer">
      <DropdownMenuItem asChild>
        <span onClick={() => scrollToDifferentItem(node, 'update', panelId)}>{t('open_in_this_panel')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <span onClick={() => scrollToDifferentItem(node, 'new', panelId)}>{t('open_in_new_panel')}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

}

export default CrossRefExternalLink
