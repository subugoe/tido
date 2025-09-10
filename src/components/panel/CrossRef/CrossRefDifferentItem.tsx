import { FC, useEffect, useRef, useState } from 'react'

import { useDataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import CrossRefTitle from '@/components/panel/CrossRef/CrossRefTitle.tsx'

import { apiRequest } from '@/utils/api.ts'
import { createNewPanel, getContentTypes } from '@/utils/panel.ts'
import { waitForElementInDom } from '@/utils/dom.ts'

interface Props {
  node: HTMLElement
}

const CrossRefDifferentItem: FC<Props> = ({ node }) => {

  const { updatePanel, panelId, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const collectionId = node.getAttribute('data-ref-collection')
  const collection = useRef<Collection>(null)
  const manifestIndex = useRef(null)
  const manifest = useRef(null)
  const itemIndex = useRef(null)
  const item = useRef(null)

  const [itemLabel, setItemLabel] = useState<string>('')
  const [manifestLabel, setManifestLabel] = useState<string>('')


  async function computeNewItemIndices(sourceEl: HTMLElement) {
    collection.current = await useDataStore.getState().initCollection(collectionId)
    const manifestId = sourceEl.getAttribute('data-ref-manifest')
    const itemId = sourceEl.getAttribute('data-ref-item')

    manifestIndex.current = collection.current.sequence.findIndex(m => m.id === manifestId)
    manifest.current = await apiRequest<Manifest>(collection.current.sequence[manifestIndex.current].id)
    item.current = await apiRequest<Item>(itemId)
    itemIndex.current = manifest.current.sequence.findIndex(i => i.id === itemId)

    const newItemLabel = item.current.n ? item.current.n : item.current.title?.length > 0 ? item.current.title[0].title : ''
    setManifestLabel(manifest.current.label)
    setItemLabel(newItemLabel)
  }

  useEffect(() => {
    computeNewItemIndices(node)
  }, [])

  function openInThisPanel() {
    navigate(node, 'update', panelId)
  }

  function openInNewPanel() {
    navigate(node, 'new', panelId)
  }


  async function navigate(sourceEl: HTMLElement, action: string, panelId: string) {
    let targetEl
    let newPanelId = panelId
    const contentType = sourceEl.getAttribute('data-ref-content-type')
    const selector = sourceEl.getAttribute('data-ref-target')

    const newContentTypes = getContentTypes(item.current.content)
    const newContentIndex = newContentTypes.findIndex(type => type === contentType)

    if (action === 'new') {
      newPanelId = crypto.randomUUID()
      await createNewPanel(collectionId, manifest.current, item.current, newContentIndex, newPanelId)
    }

    else if (action === 'update') {
      updatePanel({
        collectionId,
        manifest: manifest.current,
        item: item.current,
        contentIndex: newContentIndex
      })
    }

    waitForElementInDom('#' + newPanelId, selector, (panelEl: HTMLElement) => {
      targetEl = panelEl.querySelector(selector) as HTMLElement
    })

    // use setTimeout to create a small delay before actually scrolling to target
    setTimeout(async () => {
      targetEl.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  const link = <a className="text-blue-600 underline cursor-pointer">
    {node.innerHTML}
  </a>


  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {link}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" className="p-2">
      <DropdownMenuLabel>
        {t('reference')}
      </DropdownMenuLabel>
      <CrossRefTitle contentType={node.getAttribute('data-ref-content-type')} manifestLabel={manifestLabel} itemLabel={itemLabel} />
      <DropdownMenuItem className="mt-2 cursor-pointer" onSelect={openInThisPanel}>
        <span>{t('open_in_this_panel')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer" onSelect={openInNewPanel}>
        <span>{t('open_in_new_panel')} <ExternalLink size={16} className="inline" /></span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

}

export default CrossRefDifferentItem
