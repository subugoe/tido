import React, { FC, useEffect, useRef, useState } from 'react'
import { getRootCrossRefElements } from '@/utils/text.ts'
import { createPortal } from 'react-dom'
import CrossRefLink from '@/components/panel/CrossRef/CrossRefLink.tsx'
import { isFiltered } from '@/utils/annotations.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString?: string,
  onReady?: () => void,
  matchedAnnotationsMap?: object,
  activeContentUrl: string,
  selectedAnnotationTypes: object,
  updateMatchedAnnotationsMap: (newMatchedAnnotationsMap: object) => void,
  onClickTarget: (e: Event) => void,
  onMouseEnterTarget: (e: Event) => void,
  onMouseLeaveTarget: (e: Event) => void,
  isAnnotation: boolean
}
const GenericTextRenderer: FC<Props> = ({ htmlString, onReady, matchedAnnotationsMap, updateMatchedAnnotationsMap, activeContentUrl, isAnnotation
  , selectedAnnotationTypes, onClickTarget, onMouseEnterTarget, onMouseLeaveTarget }) => {
  const { annotations } = usePanel()
  const [portals, setPortals] = useState([])
  const textWrapperRef = useRef<HTMLDivElement>(null)

  // Document object that is only recreated when htmlString changes - e.g. on item change or content type change
  const parsedDom: Element = React.useMemo(() => {
    if (htmlString === '') return
    const doc = new DOMParser().parseFromString(`${htmlString}`, 'text/html')
    return doc.querySelector('body')
  }, [htmlString])

  // Make the text visible - set the content of the Document object as children of textWrapperRef.
  // Create cross ref links with portals.
  useEffect(() => {
    if (!parsedDom) return

    const links = getRootCrossRefElements(parsedDom)
    setPortals(links.map(link => {
      const mount = document.createElement(link.tagName)
      link.replaceWith(mount)
      return createPortal(<CrossRefLink node={link as HTMLElement} />, mount)
    }))

    textWrapperRef.current.replaceChildren(parsedDom)
    onReady()
  }, [parsedDom])

  // Create and set matchedAnnotationsMap by identifying target nodes. Add click listeners to targets.
  useEffect(() => {
    if (!annotations || !parsedDom) return

    const result = annotations.reduce<MatchedAnnotationsMap>((acc, cur) => {
      const isSource = cur.target[0].source === activeContentUrl
      const selector = (cur.target[0].selector as CssSelector)?.value

      if (!isSource || !selector) {
        if (!selector) console.error('Annotation error','Selector value of target is empty for this annotation', cur)
        return acc
      }

      const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))

      if (matchedNodes.length > 0) {
        matchedNodes.forEach(target => {
          target.addEventListener('click', onClickTarget)
          target.addEventListener('mouseenter', onMouseEnterTarget)
          target.addEventListener('mouseleave', onMouseLeaveTarget)
        })

        acc[cur.id] = {
          target: matchedNodes,
          annotation: cur
        }

        if (!isAnnotation) acc[cur.id].filtered = !selectedAnnotationTypes || isFiltered(cur, selectedAnnotationTypes)
      }
      return acc
    }, {})

    updateMatchedAnnotationsMap(result)
  }, [parsedDom, annotations])

  return <div ref={textWrapperRef}>
    {portals}
  </div>
}

export default GenericTextRenderer
