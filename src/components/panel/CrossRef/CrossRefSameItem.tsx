import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu.tsx'

import CrossRefTitle from '@/components/panel/CrossRef/CrossRefTitle.tsx'
import { ExternalLink } from 'lucide-react'

import { createNewPanel } from '@/utils/panel.ts'
import { waitForElementInDom } from '@/utils/dom.ts'

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

  async function navigate(sourceEl: HTMLElement, contentTypes: string[], action: string) {
    const targetContentType = sourceEl.getAttribute('data-ref-content-type')
    const targetSelector = sourceEl.getAttribute('data-ref-target')
    const newContentIndex = contentTypes.findIndex(type => type === targetContentType)
    let panelEl, targetEl

    if (action === 'new') {
      const newPanelId = crypto.randomUUID()
      await createNewPanel(collectionId, manifest, item, newContentIndex, newPanelId)
      waitForElementInDom('#' + newPanelId, targetSelector ,(newPanelEl: HTMLElement) => {
        targetEl = newPanelEl.querySelector(targetSelector)
      })
    }

    if (action === 'scroll-to') {
      updatePanel({ contentIndex: newContentIndex })
      panelEl = document.getElementById(panelId)
      targetEl = panelEl.querySelector(targetSelector) as HTMLElement
    }
    setTimeout(() => {
      // add timeout for smoother scrolling to target after clicking the link
      if (targetEl)  targetEl.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }

  function jumpTo() {
    navigate(node, contentTypes, 'scroll-to')
  }

  function openInNewPanel() {
    navigate(node, contentTypes, 'new')
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
      <DropdownMenuSeparator></DropdownMenuSeparator>
      <DropdownMenuItem className="mt-2 cursor-pointer" onSelect={jumpTo}>
        <span>{t('jump_to')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer" onSelect={openInNewPanel}>
        <span>{t('open_in_new_panel')} <ExternalLink size={16} className="inline" /></span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>


}

export default CrossRefSameItem
