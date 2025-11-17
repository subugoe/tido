import { FC, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'

import { LoaderCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'

import { createNewPanel, getContentTypes } from '@/utils/panel.ts'
import { existsTargetInText, waitForElementInDom } from '@/utils/dom.ts'

import Content from '@/components/panel/CrossRef/Content'
import { validateCrossRefNode } from '@/utils/cross-ref.ts'

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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const loadedData = useRef<boolean>(null)


  async function computeNewItemIndices(sourceEl: HTMLElement) {
    const { manifestData, itemData } = await validateCrossRefNode(sourceEl)
    manifest.current = manifestData
    item.current = itemData
    const newItemLabel = itemData.n ? itemData.n : itemData.title?.length > 0 ? itemData.title[0].title : ''
    setManifestLabel(manifestData.label)
    setItemLabel(newItemLabel)
    return itemData
  }

  async function onSelectLink() {
    if (!error && !loadedData.current) {
      setLoading(true)
      try {
        const item = await computeNewItemIndices(node)
        const contentType = node.getAttribute('data-ref-content-type')
        const selector = node.getAttribute('data-ref-target')
        if (!await existsTargetInText(item, contentType, selector)) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')
        loadedData.current = true
      } catch(e) {
        setError(new CustomError(t(e.name), t(e.message)))
      } finally {
        setLoading(false)
        setOpenModal(true)
      }
    }

    setOpenModal(true)
  }

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

  const link = <a type="button" onClick={onSelectLink} className="text-blue-600 underline cursor-pointer">
    {node.innerHTML}
  </a>

  return <>{link}
    {loading && <LoaderCircle size={36} className="animate-spin" />}
    <DropdownMenu open={openModal} onOpenChange={() => setOpenModal(!openModal)}>
      <DropdownMenuTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="p-2 max-w-sm text-wrap">
        <Content error={error} itemLabel={itemLabel} manifestLabel={manifestLabel} node={node}
          actionLabelThisPanel={t('open_in_this_panel')}  actionNewPanel={openInNewPanel} actionThisPanel={openInThisPanel}  />
      </DropdownMenuContent>
    </DropdownMenu></>
}

export default CrossRefDifferentItem
