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
  const { panelState, panelId } = usePanel()
  const panels = panelStore(state => state.panels)
  const collectionId = panelState.collectionId
  const collectionAnnotations = dataStore(state => state.annotations[collectionId])
  const scrollPanels = scrollStore(state => state.panels)

  useEffect(() => {
    if (!scrollPanels[panelId]) return
    const otherScrollPanelIds = Object.keys(scrollPanels).filter(scrollPanelId => scrollPanelId !== panelId)
    let scrollOnSelectTime = 0

    ref.current?.addEventListener('scroll', () => {
      const now = Date.now()
      console.log(now - scrollOnSelectTime)
      if (now - scrollOnSelectTime < 50) return
      otherScrollPanelIds.forEach(otherScrollPanelId => {
        const parallelScrollContainer = document.querySelector(`[data-panel="${otherScrollPanelId}"]`)
        if (!parallelScrollContainer) return
        parallelScrollContainer.scrollTop = ref.current?.scrollTop ?? 0
      })
    })

    collectionAnnotations.forEach((annotation) => {
      const targets = annotation.target

      const filteredTargets = targets.filter(target => {
        const value = target.source
        const annotationManifestId = value.split('_')[0]
        const manifestId = panelState.manifest.id
        console.log(annotationManifestId, manifestId)
        return annotationManifestId === manifestId
      })

      const otherFilteredTargets = targets.filter(target => {
        const value = target.source
        const annotationManifestId = value.split('_')[0]
        const manifestId = panelState.manifest.id
        return annotationManifestId !== manifestId
      })

      console.log(filteredTargets)

      filteredTargets.forEach(target => {
        const value = (target.selector as CssSelector).value
        document.querySelector(value)?.addEventListener('click', () => {
          console.log('click', panels)
          Object.keys(panels).filter(key => key !== panelId).forEach(key => {
            console.log(key)

            const parallelScrollContainer = document.querySelector(`[data-panel="${key}"]`)

            otherFilteredTargets.forEach(target => {
              const value = target.selector.value
              const el = parallelScrollContainer.querySelector(value)
              console.log(el)

              if (!el) return
              scrollOnSelectTime = Date.now()
              parallelScrollContainer.scrollTo({
                top: el.getBoundingClientRect().top,
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
