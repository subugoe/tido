import { FC, useEffect, useRef } from 'react'
import { dataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { scrollStore } from '@/store/ScrollStore.tsx'

interface Props {
  htmlString: string
}

const TextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { panelState, panelId } = usePanel()
  const collectionId = panelState.collectionId
  const collectionAnnotations = dataStore(state => state.annotations[collectionId])
  const scrollPanels = scrollStore(state => state.panels)


  useEffect(() => {
    if (!scrollPanels[panelId]) return
    const otherScrollPanelIds = Object.keys(scrollPanels).filter(scrollPanelId => scrollPanelId !== panelId)

    ref.current?.addEventListener('scroll', () => {
      otherScrollPanelIds.forEach(otherScrollPanelId => {
        const parallelScrollContainer = document.querySelector(`[data-panel="${otherScrollPanelId}"]`)
        if (!parallelScrollContainer) return
        parallelScrollContainer.scrollTop = ref.current?.scrollTop ?? 0
      })
    })


    if (!collectionAnnotations) return

    collectionAnnotations.forEach(annotation => {
      const { target } = annotation

      target.forEach(({ source, selector }) => {
        const [manifestId, itemId] = source.split('_')
        if (manifestId === panelState.manifest.id && itemId === panelState.item.id) {
          const el = ref.current?.querySelector((selector as CssSelector).value)
          if (!el) return
          el.setAttribute('data-scroll-target', 'true')
          el.classList.add('t-bg-gray-100')
        }
      })
    })

  }, [collectionAnnotations])

  useEffect(() => {

    if (!ref?.current) return

    const scrollContainer = ref.current as HTMLElement
    const parent = scrollContainer.parentElement
    if (!parent) return

    scrollContainer.innerHTML = htmlString
  }, [htmlString])

  return <div data-panel={panelId} ref={ref} className="t-h-full t-overflow-auto" />

}

export default TextRenderer
