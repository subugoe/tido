import { FC, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'


import { createNewPanel } from '@/utils/panel.ts'
import { existsTargetInText, validateSelector, waitForElementInDom } from '@/utils/dom.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { toast } from 'sonner'
import Content from '@/components/panel/CrossRef/Content.tsx'

interface Props {
  node: HTMLElement
}

const CrossRefSameItem: FC<Props> = ({ node }) => {

  const { updatePanel, panelState, usePanelTranslation, panelId } = usePanel()
  const { collectionId, manifest, item } = panelState
  const { t } = usePanelTranslation()
  const contentTypes = panelState.contentTypes

  const manifestLabel = panelState.manifest.label
  const itemLabel = item.n ? item.n : item.title?.length > 0 ? item.title[0].title : ''

  const target = useRef<HTMLElement>(null)

  const [error, setError] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  async function navigate(sourceEl: HTMLElement, contentTypes: string[], action: string) {
    try {
      const targetContentType = sourceEl.getAttribute('data-ref-content-type')
      const targetSelector = sourceEl.getAttribute('data-ref-target')
      const newContentIndex = contentTypes.findIndex(type => type === targetContentType)

      if (action === 'new') {
        const newPanelId = crypto.randomUUID()
        await createNewPanel(collectionId, manifest, item, newContentIndex, newPanelId)
        waitForElementInDom('#' + newPanelId, targetSelector ,(newPanelEl: HTMLElement) => {
          scrollToTarget(targetSelector, newPanelEl)
        })
      }

      if (action === 'scroll-to') {
        if (newContentIndex !== panelState.contentIndex) updatePanel({ contentIndex: newContentIndex })
        setTimeout(() => {
          scrollToTarget(targetSelector, document.getElementById(panelId))
        }, 500)
      }
    } catch(e) {
      const panelNumber = usePanelStore.getState().panels.findIndex(p => p.id === panelId) + 1
      console.error(e + ' ' + panelNumber.toString())
      toast.error(e +' ' + panelNumber.toString())
    }
  }

  async function onSelectLink() {
    if (!target.current && !error) {
      // validating content type and target's selector while clicking for first time
      try {
        const targetContentType = node.getAttribute('data-ref-content-type')
        if (!contentTypes.includes(targetContentType)) throw new CustomError('cross_ref_error_title', 'referenced_content_type_error')

        const targetSelector = node.getAttribute('data-ref-target')
        if (!validateSelector(targetSelector)) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')

        const targetEl = await existsTargetInText(panelState.item, targetContentType, targetSelector) as HTMLElement
        if (!targetEl) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')
        target.current = targetEl
      } catch(e) {
        setError(new CustomError(t(e.name), t(e.message.split(';')[0], { url: e.message.split(';')[1] })))
      } finally {
        setOpenModal(true)
      }
    }
    setOpenModal(true)
  }

  function jumpTo() {
    navigate(node, contentTypes, 'scroll-to')
  }

  function openInNewPanel() {
    navigate(node, contentTypes, 'new')
  }

  function scrollToTarget(targetSelector: string, panelEl: Element) {
    const targetEl = panelEl.querySelector(targetSelector) as HTMLElement
    targetEl.scrollIntoView({ behavior: 'smooth' })
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
      <DropdownMenuContent align="center" className="p-2 max-w-sm text-wrap">
        <Content error={error} itemLabel={itemLabel} manifestLabel={manifestLabel} node={node}
          actionLabelThisPanel={t('jump_to')} actionNewPanel={openInNewPanel} actionThisPanel={jumpTo} />
      </DropdownMenuContent>
    </DropdownMenu></>
}

export default CrossRefSameItem
