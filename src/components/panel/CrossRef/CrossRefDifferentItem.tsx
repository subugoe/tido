import { FC, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'

import { createNewPanel } from '@/utils/panel.ts'
import { existsTargetInText, waitForElementInDom } from '@/utils/dom.ts'

import Content from '@/components/panel/CrossRef/Content'
import { validateCrossRefNode } from '@/utils/cross-ref.ts'
import Loading from '@/components/ui/loading.tsx'

interface Props {
  node: HTMLElement
}

const CrossRefDifferentItem: FC<Props> = ({ node }) => {

  const { updatePanel, panelId, usePanelTranslation } = usePanel()

  const { t } = usePanelTranslation()

  const collectionId = node.getAttribute('data-ref-collection')
  const collection = useRef(null)
  const manifest = useRef(null)
  const item = useRef(null)
  const [itemLabel, setItemLabel] = useState<string>('')
  const [manifestLabel, setManifestLabel] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const loadedData = useRef<boolean>(null)


  async function computeNewItemIndices(sourceEl: HTMLElement) {
    const { collection: collectionData, manifestData, itemData } = await validateCrossRefNode(sourceEl)
    collection.current = collectionData
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


  async function navigate(sourceEl: HTMLElement, action: string, panelId?: string) {
    let targetEl
    let newPanelId = panelId
    const contentType = sourceEl.getAttribute('data-ref-content-type')
    const selector = sourceEl.getAttribute('data-ref-target')

    if (action === 'new') {
      newPanelId = crypto.randomUUID()
      await createNewPanel(collectionId, manifest.current, item.current, contentType, newPanelId)
    } else if (action === 'update') {
      const collectionId = sourceEl.getAttribute('data-ref-collection')
      const manifestId = sourceEl.getAttribute('data-ref-manifest')
      const itemId = sourceEl.getAttribute('data-ref-item')

      updatePanel({
        config: {
          collection: collectionId,
          manifest: manifestId,
          item: itemId,
          contentType
        }
      })
    }

    waitForElementInDom('#' + newPanelId, selector, (panelEl: HTMLElement) => {
      targetEl = panelEl.querySelector(selector) as HTMLElement

      // use setTimeout to create a small delay before actually scrolling to target
      setTimeout(async () => {
        targetEl.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    })
  }

  const link = <a
    type="button"
    onClick={onSelectLink}
    className="text-blue-600 underline cursor-pointer"
    dangerouslySetInnerHTML={{ __html: node.innerHTML }}
  ></a>

  return <>{link}
    <DropdownMenu open={openModal} onOpenChange={() => setOpenModal(!openModal)}>
      <DropdownMenuTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="p-2 max-w-sm text-wrap rounded-lg relative overflow-hidden">
        <Content error={error} itemLabel={itemLabel} manifestLabel={manifestLabel} node={node}
          actionLabelThisPanel={t('open_in_this_panel')}  actionNewPanel={openInNewPanel} actionThisPanel={openInThisPanel}  />
        {loading && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
          <Loading size={36} />
        </div>}
      </DropdownMenuContent>
    </DropdownMenu></>
}

export default CrossRefDifferentItem
