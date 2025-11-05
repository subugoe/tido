import {
  FC,
  memo,
  useEffect,
  useRef,
  useState
} from 'react'

import React from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import CrossRefLink from '@/components/panel/CrossRef/CrossRefLink.tsx'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { useText } from '@/contexts/TextContext.tsx'
import {
  addAnnotationId,
  addHighlightStyle,
  addHoverStyle,
  addSelectedStyle,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getCrossRefElements,
  isSelected,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import { createPortal } from 'react-dom'

interface Props {
  htmlString: string
  aGroup?: boolean
  onReady?: () => void
}

const targetSelectionObject = {}

const TextRenderer: FC<Props> = memo(({ htmlString, onReady }) => {
  const textWrapperRef = useRef<HTMLInputElement>(null)
  const {
    panelState,
    fullAnnotationTypes,
    matchedAnnotationsMap,
    setMatchedAnnotationsMap,
    setSelectedAnnotation,
    updatePanel,
    panelId,
    selectedAnnotation,
    annotationsMode
  } = usePanel()

  const { hoveredAnnotation, setHoveredAnnotation } = useText()

  const [portals, setPortals] = useState([])

  function scrollIntoSelectedAnnotation(selectedAnnotation: Annotation) {
    const annotationId = selectedAnnotation?.id
    const panelEl = document.getElementById(panelId) as HTMLElement
    const container = panelEl.querySelector('div[data-sidebar-container]') as HTMLElement
    const annotationEl = container.querySelector('div[data-annotation="'+annotationId+'"]') as HTMLElement
    scrollIntoViewIfNeeded(annotationEl, container)
  }

  function getNewTargetSelection(targetAnnotationIds: string[], targetSelectionObject, targetId: string ) {
    const newTargetSelectionObject = { ...targetSelectionObject }
    if (!Object.hasOwn(newTargetSelectionObject, targetId))  newTargetSelectionObject[targetId] = 0
    if (newTargetSelectionObject[targetId] < targetAnnotationIds.length - 1) newTargetSelectionObject[targetId] += 1
    else newTargetSelectionObject[targetId] = 0

    return newTargetSelectionObject
  }

  const onClickTarget = (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as Element
    const targetId = target.getAttribute('id')
    const idsValue = getAnnotationIds(target)

    if (!idsValue) return

    const idArr = idsValue.split(',')

    const newTargetSelectionObject = getNewTargetSelection(idArr, targetSelectionObject, targetId)
    targetSelectionObject[targetId] = newTargetSelectionObject[targetId]
    const newSelectedAnnotationIdx = targetSelectionObject[targetId]
    const newAnnotationId = idArr[newSelectedAnnotationIdx]

    const annotation = panelState.annotations.find(a => a.id === newAnnotationId)

    if (annotation) {
      if (!panelState.annotationsOpen) {
        updatePanel({ annotationsOpen: true })
      }

      if (isSelected(target) && idArr.length === 1) setSelectedAnnotation(null)
      else setSelectedAnnotation(annotation)
      if (annotationsMode === 'list') scrollIntoSelectedAnnotation(annotation)
    }
  }

  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as Element
    const idsValue = getAnnotationIds(target)
    if (!idsValue) return

    const idArr = idsValue.split(',')
    const last = idArr[idArr.length - 1]

    setHoveredAnnotation(last)
  }

  const onMouseLeaveTarget = () => {
    setHoveredAnnotation(null)
  }

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

    const links = getCrossRefElements(parsedDom)
    setPortals(links.map(link => {
      const mount = document.createElement(link.tagName)
      link.replaceWith(mount)
      return createPortal(<CrossRefLink node={link} />, mount)
    }))

    textWrapperRef.current.replaceChildren(parsedDom)
    onReady()
  }, [parsedDom])

  // Create and set matchedAnnotationsMap by identifying target nodes. Add click listeners to targets.
  useEffect(() => {
    if (!panelState.annotations || !parsedDom) return

    const result: MatchedAnnotationsMap = panelState.annotations.reduce((acc, cur) => {
      const selector = (cur.target[0].selector as CssSelector).value
      if (!selector) {
        console.error('Annotation error','Selector value of target is empty for this annotation', cur)
        return acc
      }

      const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))
      if (matchedNodes.length > 0) {
        matchedNodes.forEach(target => {
          target.addEventListener('click', onClickTarget)
          target.addEventListener('mouseenter', onMouseEnterTarget)
          target.addEventListener('mouseleave', onMouseLeaveTarget)

        })
        const annotType = cur.body['x-content-type']
        acc[cur.id] = { target: matchedNodes, filtered: fullAnnotationTypes ? fullAnnotationTypes[annotType] ?? true : false, annotation: cur }
      }
      return acc
    }, {})

    setMatchedAnnotationsMap(result)
  }, [parsedDom, panelState.annotations])

  // Update hover styles each time hoveredAnnotation changes
  useEffect(() => {
    Object.keys(matchedAnnotationsMap).forEach(key => {
      const matched = matchedAnnotationsMap[key]
      if (!matched.filtered) return
      matched.target.forEach(target => {
        removeHoverStyle(target)
      })
    })

    if (!hoveredAnnotation) return
    const matched = matchedAnnotationsMap[hoveredAnnotation]
    matched.target.forEach(target => {
      addHoverStyle(target)
    })
  }, [hoveredAnnotation])

  // Apply highlighting styles on every map update
  useEffect(() => {
    flipMatchedAnnotationsMap(matchedAnnotationsMap).forEach(fa => {
      const annotations = fa.annotations
      const target = fa.target

      let someFiltered = false

      removeAnnotationIds(target)
      removeHighlightStyle(target)

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((annotation, i) => {
        if (fa.filtered[i]) {
          addAnnotationId(target, annotation.id)
        }
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [matchedAnnotationsMap])

  // Apply selected styles on every selectedAnnotation update
  useEffect(() => {
    flipMatchedAnnotationsMap(matchedAnnotationsMap).forEach(fa => {
      const annotations = fa.annotations
      const target = fa.target

      let someSelected = false
      let someFiltered = false

      removeSelectedStyle(target)

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((annotation, i) => {
        if (!fa.filtered[i]) return
        const isSelected = selectedAnnotation && selectedAnnotation.id === annotation.id
        someSelected = !someSelected ? isSelected : true
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (someSelected) {
        removeHighlightStyle(target)
        addSelectedStyle(target)
        return
      }

      if (someFiltered) addHighlightStyle(target)
    })
  }, [selectedAnnotation])

  return <div className="relative">
    <div ref={textWrapperRef}></div>
    {portals}
  </div>
})

export default TextRenderer
