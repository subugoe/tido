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
  addHoverStyle, addNestedTargetStyle,
  addSelectedStyle,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getRootCrossRefElements,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  isTargetPartOfSelectedAnnotation,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeNestedTargetStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import { createPortal } from 'react-dom'
import { computeNewSelectedAnnotationIndex } from '@/utils/annotations.ts'
import { useTextView } from '@/contexts/TextViewContext.tsx'

interface Props {
  htmlString: string
  aGroup?: boolean
  onReady?: () => void
}

const TextRenderer: FC<Props> = memo(({ htmlString, onReady }) => {
  const textWrapperRef = useRef<HTMLInputElement>(null)
  const {
    panelState,
    selectedAnnotationTypes,
    setSelectedAnnotation,
    updatePanel,
    selectedAnnotation,
    annotationsMode,
  } = usePanel()

  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const { matchedAnnotationsMap, setMatchedAnnotationsMap, activeContentUrl } = useTextView()

  const [portals, setPortals] = useState([])

  const prevClickedTargetIndexRef = useRef<number>(null)

  const annotationsModeRef = useRef<'aligned' | 'list'>(null)
  const flippedMatchedAnnotationsMapRef = useRef<MergedAnnotationEntry[]>(null)
  const targetsRef = useRef<HTMLElement[]>(null)

  function containsChildren(targets: HTMLElement[], target: HTMLElement) {
    for(const t of targets) {
      if (target.contains(t) && target !== t) return true
    }
    return false
  }


  const onClickTarget = (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as Element
    const targetEntry: MergedAnnotationEntry = flippedMatchedAnnotationsMapRef.current.filter(entry => entry.target === target)[0]

    if (!containsChildren(targetsRef.current, target as HTMLElement)) {
      // handle only click events on 'deepest' target -> ignore click events on its containing targets while selection
      e.stopPropagation()
    }

    const idsValue = getAnnotationIds(target)
    if (!idsValue) return

    targetEntry.selectedAnnotationIndex = computeNewSelectedAnnotationIndex(targetEntry, prevClickedTargetIndexRef.current, flippedMatchedAnnotationsMapRef.current)

    const annotation = targetEntry.selectedAnnotationIndex !== -1 ? targetEntry.annotations[targetEntry.selectedAnnotationIndex] : null

    if (annotation) {
      if (!panelState.annotationsOpen) {
        updatePanel({ annotationsOpen: true })
      }

      setSelectedAnnotation(annotation)
      prevClickedTargetIndexRef.current = flippedMatchedAnnotationsMapRef.current.findIndex(entry => targetEntry === entry)
    }
    else {
      setSelectedAnnotation(null)
    }
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])


  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current)
    if (idsArray.length === 0) return

    setHoveredAnnotations(idsArray)
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

    const links = getRootCrossRefElements(parsedDom)
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
        const annotType = cur.body['x-content-type']
        acc[cur.id] = {
          target: matchedNodes,
          filtered: !selectedAnnotationTypes || !!(selectedAnnotationTypes[annotType]),
          annotation: cur
        }
      }
      return acc
    }, {})

    setMatchedAnnotationsMap(result)
  }, [parsedDom, panelState.annotations])

  // Update hover styles each time hoveredAnnotation changes
  useEffect(() => {
    if (!hoveredAnnotations) return
    const targetsOfHoveredAnnotations = getTargetsHoveredAnnotations(hoveredAnnotations, targetsRef.current, matchedAnnotationsMap)
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedAnnotationsMap[selectedAnnotation.id]) ? matchedAnnotationsMap[selectedAnnotation.id].target : []

    flippedMatchedAnnotationsMapRef.current?.forEach(fa => {
      const target = fa.target as HTMLElement
      const annotations = fa.annotations

      let someFiltered = false

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((_, i) => {
        if (!fa.filtered[i]) return
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (someFiltered) {
        removeHoverStyle(target)
        removeNestedTargetStyle(target)
        removeHighlightStyle(target)

        const hasParentHovered = isParentHovered(targetsOfHoveredAnnotations, fa.parents)

        if (targetsOfHoveredAnnotations.includes(target))  {
          // Logic which hovers the targets
          // hasParentHovered: condition to determine whether we should add the style to a nested target
          if (!hasParentHovered) {
            addHoverStyle(target)
          }
          else {
            addHoverStyle(target)
            addNestedTargetStyle(target)
          }
        }
        else if (!isTargetPartOfSelectedAnnotation(target, targetsOfSelectedAnnotation)) {
          addHighlightStyle(target)
        }
      }
    })
  }, [hoveredAnnotations])

  // Apply highlighting styles on every map update
  useEffect(() => {
    if (!matchedAnnotationsMap) return
    const flippedMatchedAnnotationsMap = flipMatchedAnnotationsMap(matchedAnnotationsMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMap)
    flippedMatchedAnnotationsMapRef.current = assignNestedTargetsInFlippedMatched(targetsRef.current, flippedMatchedAnnotationsMap)

    flippedMatchedAnnotationsMapRef.current.forEach(fa => {
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
    if (!matchedAnnotationsMap) return
    const targetsOfSelectedAnnotation =
      selectedAnnotation && !!(matchedAnnotationsMap[selectedAnnotation.id])
        ? matchedAnnotationsMap[selectedAnnotation.id].target
        : []

    flippedMatchedAnnotationsMapRef.current.forEach(fa => {
      const target = fa.target as HTMLElement
      const annotations = fa.annotations

      removeSelectedStyle(target)
      removeHighlightStyle(target)

      let someFiltered = false

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((_, i) => {
        if (!fa.filtered[i]) return
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (isTargetPartOfSelectedAnnotation(target, targetsOfSelectedAnnotation)) {
        addSelectedStyle(target)
        scrollIntoViewIfNeeded(target, target.closest('[data-text-container="true"]'))
        return
      }
      else if(someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [selectedAnnotation, matchedAnnotationsMap])

  return <div className="relative flex">
    <div data-text-wrapper ref={textWrapperRef} className="pt-16"></div>
    {portals}
  </div>
})

export default TextRenderer
