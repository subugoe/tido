import { FC, useEffect, useRef } from 'react'
import { dataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { scrollStore } from '@/store/ScrollStore.tsx'
import { panelStore } from '@/store/PanelStore.tsx'

interface Props {
  htmlString: string
}

const TextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { panelState, panelId, activeTargetIndex } = usePanel()
  const panels = panelStore(state => state.panels)
  const collectionId = panelState.collectionId
  const collectionAnnotations = dataStore(state => state.annotations[collectionId])
  const scrollPanels = scrollStore(state => state.panels)

  useEffect(() => {
    if (activeTargetIndex < 0 || !collectionAnnotations) return

    const targetSelectors: string[] = []
    collectionAnnotations
      .forEach((annotation) => {
        const { target } = annotation
        target.forEach(({ source, selector }) => {
          const [manifestId, itemId] = source.split('_')
          if (manifestId === panelState.manifest.id && itemId === panelState.item.id) {
            const el = ref.current?.querySelector((selector as CssSelector).value)
            if (!el) return
            targetSelectors.push(selector.value)
          }
        })
      })

    const el = document.querySelector(targetSelectors[activeTargetIndex])

    if (!el) return
    ref.current?.setAttribute('data-auto-scrolling', '')

    ref.current?.scrollTo({
      top: el.offsetTop - ref.current?.offsetTop,
      behavior: 'smooth'
    })

    Object.keys(scrollPanels).filter(key => key !== panelId).forEach(key => {
      const parallelScrollContainer = document.querySelector(`[data-panel="${key}"]`)
      if (!parallelScrollContainer) return

      collectionAnnotations.forEach(annotation => {
        const { target } = annotation
        const currentTargets = target.find(t => t.selector.value === targetSelectors[activeTargetIndex])

        if (!currentTargets) return

        target.forEach(t => {
          if (t.selector.value === targetSelectors[activeTargetIndex]) return
          const value = t.selector.value
          const el = parallelScrollContainer.querySelector(value)

          if (!el) return
          parallelScrollContainer.setAttribute('data-auto-scrolling', '')
          parallelScrollContainer.scrollTo({
            top: el.offsetTop - parallelScrollContainer.offsetTop,
            behavior: 'smooth'
          })
        })
      })
    })

  }, [activeTargetIndex, collectionAnnotations])

  useEffect(() => {
    console.log(panelId, scrollPanels[panelId])
    if (!scrollPanels[panelId]) return
    const otherScrollPanelIds = Object.keys(scrollPanels).filter(scrollPanelId => scrollPanelId !== panelId)
    ref.current?.addEventListener('wheel', () => {
      ref.current?.removeAttribute('data-auto-scrolling')
    })

    ref.current?.addEventListener('scroll', () => {
      const isScrollingSelf = ref.current?.hasAttribute('data-auto-scrolling')

      if (isScrollingSelf) return

      otherScrollPanelIds.forEach(otherScrollPanelId => {
        const parallelScrollContainer = document.querySelector(`[data-panel="${otherScrollPanelId}"]`)
        const isScrolling = parallelScrollContainer.hasAttribute('data-auto-scrolling')
        if (!parallelScrollContainer || isScrolling) return
        parallelScrollContainer.scrollTop = ref.current?.scrollTop ?? 0
      })
    })

    collectionAnnotations.forEach((annotation) => {
      const targets = annotation.target

      const filteredTargets = targets.filter(target => {
        const value = target.source
        const annotationManifestId = value.split('_')[0]
        const manifestId = panelState.manifest.id
        return annotationManifestId === manifestId
      })

      const otherFilteredTargets = targets.filter(target => {
        const value = target.source
        const annotationManifestId = value.split('_')[0]
        const manifestId = panelState.manifest.id
        return annotationManifestId !== manifestId
      })

      filteredTargets.forEach(target => {
        const value = (target.selector as CssSelector).value
        document.querySelector(value)?.addEventListener('click', () => {
          Object.keys(scrollPanels).filter(key => key !== panelId).forEach(key => {
            const parallelScrollContainer = document.querySelector(`[data-panel="${key}"]`)
            if (!parallelScrollContainer) return
            otherFilteredTargets.forEach(target => {
              const value = target.selector.value
              const el = parallelScrollContainer.querySelector(value)

              if (!el) return
              parallelScrollContainer.setAttribute('data-auto-scrolling', '')
              parallelScrollContainer.scrollTo({
                top: el.offsetTop - parallelScrollContainer.offsetTop,
                behavior: 'smooth'
              })
            })
          })
        })
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
          el.classList.add('t-bg-gray-200', 't-cursor-pointer')
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
