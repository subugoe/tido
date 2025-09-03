import { ComponentPropsWithoutRef, ElementType, FC, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'


type GenericElementProps<T extends ElementType> = {
  props?: ComponentPropsWithoutRef<T>
  node: HTMLElement
} & ComponentPropsWithoutRef<T>

const CrossRefInternalLink: FC<GenericElementProps<T>> = ({ props, node }) => {

  const { updatePanel, panelId, panelState } = usePanel()

  const ref = useRef(null)
  const isTargetInDiffItem = node.getAttribute('data-ref-item') !== panelState.item?.id

  function onClick() {
    const panelEl = document.getElementById(panelId) as HTMLElement
    scrollToSameItem(node, panelState.contentTypes, panelState.contentIndex, panelEl)
  }


  function scrollToSameItem(sourceEl: HTMLElement, contentTypes: string[], currentContentIndex: number, panelEl: HTMLElement) {
    const targetContentType = sourceEl.getAttribute('data-ref-content-type')
    const targetSelector = sourceEl.getAttribute('data-ref-target')
    const newContentIndex = contentTypes.findIndex(type => type === targetContentType)

    if (newContentIndex === currentContentIndex) {
      const targetEl = panelEl.querySelector(targetSelector) as HTMLElement
      targetEl.scrollIntoView({ behavior: 'smooth' })
      return
    }

    // target is in new content type text
    updatePanel({ contentIndex: newContentIndex })

    const targetEl = panelEl.querySelector(targetSelector) as HTMLElement
    targetEl.scrollIntoView({ behavior: 'smooth' })
  }


  return <a ref={ref}
    className={
      (props.className || '') +
      ' text-blue-600 underline cursor-pointer'
    }
    onClick={!isTargetInDiffItem ? onClick : null}
  >
    {node.innerHTML}
  </a>
}

export default CrossRefInternalLink
