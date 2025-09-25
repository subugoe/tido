import { FC, useEffect, useRef, useState } from 'react'

import { useDataStore } from '@/store/DataStore.tsx'
import { CustomError, usePanel } from '@/contexts/PanelContext.tsx'

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
import { isCollectionUrl, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { toast } from 'sonner'

interface Props {
  node: HTMLElement
}

const CrossRefDifferentItem: FC<Props> = ({ node }) => {

  const { updatePanel, panelId, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const collectionId = node.getAttribute('data-ref-collection')
  const manifest = useRef(null)
  const item = useRef(null)
  const [itemLabel, setItemLabel] = useState<string>('')
  const [manifestLabel, setManifestLabel] = useState<string>('')

  async function validateCrossRefNode(sourceEl: HTMLElement)  {
    const collectionId = sourceEl.getAttribute('data-ref-collection')
    const manifestId = sourceEl.getAttribute('data-ref-manifest')
    const itemId = sourceEl.getAttribute('data-ref-item')
    const targetSelector = sourceEl.getAttribute('data-ref-target')
    const contentType = sourceEl.getAttribute('data-ref-content-type')

    if (!isCollectionUrl(collectionId)) throw new CustomError('CrossRef Collection url error', 'Collection url is not provided ' +
      'correctly in source html element '+sourceEl.outerHTML)
    const collection = await useDataStore.getState().initCollection(collectionId) as Collection
    if (typeof collection !== 'object' || !Object.hasOwn(collection, 'sequence')) throw new CustomError('CrossRef Collection Error ', 'Collection data format is not correct under this url '+ collectionId)
    if (!isManifestUrl(manifestId)) throw new CustomError('CrossRef Manifest url Error', 'Manifest url is not provided correctly in source html element '+sourceEl.outerHTML)
    if (!isItemUrl(itemId)) throw new CustomError('CrossRef Item url Error', 'Item url is not provided correctly in source html element '+sourceEl.outerHTML)
    if (!targetSelector.startsWith('#') && !targetSelector.startsWith('.')) throw new CustomError('CrossRef TargetSelector Error', 'Target selector is not provided correctly in source el '+ sourceEl.outerHTML)

    const manifest = await apiRequest<Manifest>(manifestId)
    if (typeof manifest !== 'object' || !Object.hasOwn(manifest, 'sequence')) throw new CustomError('CrossRef Error: Manifest data format incorrect', 'Manifest data is provided incorrectly under this url '+manifestId)
    const item = await apiRequest<Item>(itemId)
    if (typeof item !== 'object' || !Object.hasOwn(item, 'type') ) throw new CustomError('CrossRef Error Item data format incorrect', 'Item data is not provided correctly under this url '+itemId)
    const contentTypes = getContentTypes(item.content)
    if (!contentTypes.includes(contentType)) throw new CustomError('CrossRef Error Content type incorrect', 'Provided content type is not part of item content types in source el '+ sourceEl.outerHTML)

    return {
      collection,
      manifestData: manifest,
      itemData: item
    }
  }

  async function computeNewItemIndices(sourceEl: HTMLElement) {
    try {
      const { manifestData, itemData } = await validateCrossRefNode(sourceEl)
      manifest.current = manifestData
      item.current = itemData
      const newItemLabel = itemData.n ? itemData.n : itemData.title?.length > 0 ? itemData.title[0].title : ''
      setManifestLabel(manifestData.label)
      setItemLabel(newItemLabel)
    } catch(e) {
      const panelNumber = usePanelStore.getState().panels.findIndex(p => p.id === panelId) + 1
      console.error(t(e.name), { description: t(e.message) + ' ' + panelNumber.toString() })
      toast.error(t(e.name), { description: t(e.message) + ' ' + panelNumber.toString() })
    }
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
