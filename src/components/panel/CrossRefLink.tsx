import { ComponentPropsWithoutRef, ElementType, FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes } from '@/utils/panel.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { waitForElementInDom } from '@/utils/other-functions.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'

type GenericElementProps<T extends ElementType> = {
  tagName: T
  props?: ComponentPropsWithoutRef<T>
  children: ReactNode,
  node: HTMLElement,
  isHighlighted: boolean,
} & ComponentPropsWithoutRef<T>

const CrossRefLink: FC<GenericElementProps<T>> = ({ props, node, isHighlighted }) => {

  const { updatePanel, panelId, panelState } = usePanel()
  const { hoveredAnnotation, setHoveredAnnotation, selectedAnnotation } = usePanel()
  const [isHovered, setIsHovered] = useState(false)

  const ref = useRef(null)

  useEffect(() => {
    ref.current.appendChild(node)
  }, [] )

  function onClick() {
    if (isHighlighted) {
      props.onClick(props['data-annotation'])
    }
    navigateCrossRef(node, panelState.item?.id, panelState.contentTypes, panelState.contentIndex)
  }

  function handleMouseEnter() {
    if (isHighlighted) {
      setIsHovered(true)
      setHoveredAnnotation(props['data-annotation'])
    }
  }

  function handleMouseLeave() {
    setIsHovered(false)
    setHoveredAnnotation(null)
  }

  useEffect(() => {
    if (!hoveredAnnotation) setIsHovered(false)
    else if (hoveredAnnotation === props['data-annotation']) setIsHovered(true)
  }, [hoveredAnnotation])

  function navigateCrossRef(sourceEl: HTMLElement, currentItemId: string, currentContentTypes: string[], currentContentIndex: number) {
    const targetSelector = sourceEl.getAttribute('data-ref-target')
    const targetItemId = sourceEl.getAttribute('data-ref-item')
    const targetContentType = sourceEl.getAttribute('data-ref-content-type')
    if (targetItemId === currentItemId) {
      const panelEl = document.getElementById(panelId)
      const targetEl = panelEl.querySelector(targetSelector) as HTMLElement
      scrollTargetWithinPanel(targetEl, targetContentType, currentContentTypes, currentContentIndex)
      return
    }
    scrollTargetInNewPanel(sourceEl, targetSelector, targetContentType)
  }

  function scrollTargetWithinPanel(targetEl: HTMLElement, targetContentType: string, contentTypes: string[], currentContentIndex: number) {
    const targetContentIndex = contentTypes.findIndex(type => type === targetContentType)
    if (targetContentIndex === currentContentIndex) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
      return
    }
    // target is in new content type text
    setTimeout(() => {
      updatePanel({ contentIndex: targetContentIndex })
    }, 200)

    targetEl.scrollIntoView({ behavior: 'smooth' })
  }

  async function scrollTargetInNewPanel(sourceEl: HTMLElement, selector: string, contentType: string) {
    // if target lies in another item create a new panel with the corresponding text api collection, manifest, item ids, content index AND scroll to target
    const collectionId = sourceEl.getAttribute('data-ref-collection')
    const manifestId = sourceEl.getAttribute('data-ref-manifest')
    const itemId = sourceEl.getAttribute('data-ref-item')

    const newPanelId = crypto.randomUUID()
    useUIStore.getState().updateNewestPanelId(newPanelId)

    const collection = await useDataStore.getState().initCollection(collectionId)
    const manifestIndex = collection.sequence.findIndex(m => m.id === manifestId)
    const manifest = await apiRequest<Manifest>(collection.sequence[manifestIndex].id)
    const itemIndex = manifest.sequence.findIndex(i => i.id === itemId)
    const item = await apiRequest<Item>(itemId)
    const newContentTypes = getContentTypes(item.content)
    const newContentIndex = newContentTypes.findIndex(type => type === contentType)

    const newPanelConfig = {
      collection: collectionId,
      manifestIndex,
      itemIndex,
      contentIndex: newContentIndex
    }

    await usePanelStore.getState().addPanel(newPanelConfig, newPanelId)

    // use setTimeout to create a small delay after creating a new panel
    setTimeout(async () => {
      waitForElementInDom('#'+newPanelId, (panelEl: HTMLElement) => {
        const targetEl = panelEl.querySelector(selector) as HTMLElement
        targetEl.scrollIntoView({ behavior: 'smooth' })
      })
    }, 500)
  }


  return (
    <a ref={ref}
      className={
        (props.className || '') +
        (isHighlighted ? ' bg-gray-200 relative cursor-pointer' : '') +
        ' text-blue-600 underline cursor-pointer' +
        (isHovered ? ' bg-primary/20' : '') +
        (selectedAnnotation && selectedAnnotation.id === props['data-annotation'] ? 'bg-primary/40' : '')
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
    </a>

  )
}

export default CrossRefLink
