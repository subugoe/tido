import { FC, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { CustomError } from '@/utils/custom-error.ts'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'


import { createNewPanel, setNewActiveContentType } from '@/utils/panel.ts'
import { existsTargetInText, validateSelector, waitForElementInDom } from '@/utils/dom.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { toast } from 'sonner'
import Content from '@/components/panel/CrossRef/Content.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'

interface Props {
  node: HTMLElement
}

const CrossRefSameItem: FC<Props> = ({ node }) => {
  const { panelViews: panelViewsConfig } = useConfig()

  const { panelState, usePanelTranslation, panelId } = usePanel()
  const { activeContentType, setActiveContentType, contentTypes } = useTextView()
  const { collectionId, manifest, item } = panelState
  const { t } = usePanelTranslation()

  const manifestLabel = manifest.label
  const itemLabel = item.n ? item.n : item.title?.length > 0 ? item.title[0].title : ''

  const target = useRef<HTMLElement>(null)

  const [error, setError] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  async function navigate(sourceEl: HTMLElement, action: string) {
    try {
      const targetContentType = sourceEl.getAttribute('data-ref-content-type')
      const targetSelector = sourceEl.getAttribute('data-ref-target')

      // We need to open that content which contains the cross ref target. Since a panel can have multiple views,
      // we need to find out which view is able to display the content type. Because panel views can be configured freely,
      // we cannot know which view is meant exactly. So we just take the first found.
      const firstViewIndex = panelState.panelViews.findIndex(view => view.contentTypes.includes(targetContentType))

      if (action === 'new') {
        const newPanelId = crypto.randomUUID()
        await createNewPanel(
          collectionId,
          manifest,
          item,
          setNewActiveContentType(targetContentType, firstViewIndex, panelViewsConfig),
          newPanelId
        )
        waitForElementInDom('#' + newPanelId, targetSelector, (newPanelEl: HTMLElement) => {
          scrollToTarget(targetSelector, newPanelEl)
        })
      }

      if (action === 'scroll-to') {
        if (targetContentType !== activeContentType) setActiveContentType(targetContentType)
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
    navigate(node, 'scroll-to')
  }

  function openInNewPanel() {
    navigate(node, 'new')
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
