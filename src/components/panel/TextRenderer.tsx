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

interface targetSelectionDictType {
  el: HTMLElement,
  selectedAnnotationIndex: number
}

let targetSelectionDict: targetSelectionDictType = { el: null, selectedAnnotationIndex: null }
// [{
//  el: HTMLElement, selectedAnnotationIndex: number
//  }]

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

  const { hoveredAnnotations, setHoveredAnnotations } = useText()

  const [portals, setPortals] = useState([])

  const annotationsModeRef = useRef<'align' | 'list'>(null)

  function scrollIntoSelectedAnnotation(selectedAnnotation: Annotation) {
    const annotationId = selectedAnnotation?.id
    const panelEl = document.getElementById(panelId) as HTMLElement
    const container = panelEl.querySelector('div[data-sidebar-container]') as HTMLElement
    const annotationEl = container.querySelector('div[data-annotation="'+annotationId+'"]') as HTMLElement
    scrollIntoViewIfNeeded(annotationEl, container)
  }

  function isNewTargetSelection(targetSelectionDict: targetSelectionDictType, selectedTarget: HTMLElement) {
    return targetSelectionDict.el !== selectedTarget
  }

  function getUpdatedTargetSelection(targetAnnotationIds: string[], targetSelection: targetSelectionDictType, target: HTMLElement ) {
    const newTargetSelectionObject: targetSelectionDictType = { ...targetSelection }

    if (isNewTargetSelection(targetSelection, target)) {
      newTargetSelectionObject.el = target
      newTargetSelectionObject.selectedAnnotationIndex = 0
      return newTargetSelectionObject
    }

    if (newTargetSelectionObject.selectedAnnotationIndex < targetAnnotationIds.length - 1) {
      newTargetSelectionObject.selectedAnnotationIndex += 1
    }

    else {
      // we reached the last selected annotation -> we set idx to -1 which signalises later that we deselect the target
      newTargetSelectionObject.selectedAnnotationIndex = -1
    }
    return newTargetSelectionObject
  }

  const onClickTarget = (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as Element
    const targetHtml = e.currentTarget as HTMLElement
    const idsValue = getAnnotationIds(target)
    if (!idsValue) return

    const idArr = idsValue.split(',')

    let newAnnotationId = null
    targetSelectionDict = getUpdatedTargetSelection(idArr, targetSelectionDict, targetHtml)
    const newSelectedAnnotationIndex = targetSelectionDict.selectedAnnotationIndex
    if (newSelectedAnnotationIndex !== -1) newAnnotationId = idArr[newSelectedAnnotationIndex]
    // index among target annotations

    const annotation = panelState.annotations.find(a => a.id === newAnnotationId)

    if (annotation) {
      if (!panelState.annotationsOpen) {
        updatePanel({ annotationsOpen: true })
      }

      setSelectedAnnotation(annotation)
      if (annotationsModeRef.current === 'list') scrollIntoSelectedAnnotation(annotation)
    }
    else {
      setSelectedAnnotation(null)
    }
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])


  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as Element
    const idsValue = getAnnotationIds(target)
    if (!idsValue) return

    const idArr = idsValue.split(',')
    setHoveredAnnotations(idArr)
  }

  const onMouseLeaveTarget = () => {
    setHoveredAnnotations(null)
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

    if (!hoveredAnnotations) return
    hoveredAnnotations.forEach((annotation) => {
      const matched = matchedAnnotationsMap[annotation]
      matched.target.forEach(target => {
        addHoverStyle(target)
      })
    })

  }, [hoveredAnnotations])

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
