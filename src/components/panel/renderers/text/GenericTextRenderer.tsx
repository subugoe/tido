import React, { FC, memo, useEffect, useRef, useState } from 'react'
import {
  addActiveTargetStyle,
  addAnnotationBaseStyle,
  addAnnotationId,
  addCrossRefTargetStyle,
  addHighlightStyle,
  addHoverStyle,
  addNestedTargetStyle,
  addSelectedStyle,
  addSyncAnnotationId,
  addSyncHighlightStyle,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getSyncAnnotationIds,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  partOfSelectedTargets,
  removeActiveTargetStyle,
  removeAnnotationBaseStyle,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeNestedTargetStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import {
  getAnnotationContentType,
  getNestedAnnotations,
  getSource,
  isFiltered
} from '@/utils/annotations.ts'
import { useText } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { containsChildren } from '@/utils/text.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import AnnotationPopoverContainer from '@/components/panel/annotations/popover/AnnotationPopoverContainer.tsx'
import AnnotationPopoverContent from '@/components/panel/annotations/popover/AnnotationPopoverContent.tsx'

interface Props {
  htmlString?: string
  onReady?: () => void
  onUpdateMatchedAnnotationsMap?: (map: MatchedAnnotationsMap) => void
  source: string
  onSelect?: () => void
  ignoreFilters?: boolean
  paddingTop?: boolean
}
const GenericTextRenderer: FC<Props> = memo(({
  htmlString,
  onReady,
  onUpdateMatchedAnnotationsMap,
  source,
  onSelect,
  ignoreFilters = false,
  paddingTop = false
}) => {
  const { annotations: annotationsConfig } = useConfig()
  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const {
    selectedAnnotation,
    selectedAnnotationTypes,
    setSelectedAnnotation,
    annotations,
    syncAnnotations,
    updateSyncMap,
    setHoveredSyncAnnotations
  } = usePanel()
  const [matchedMap, setMatchedMap] = useState<MatchedAnnotationsMap>({})

  const [tooltipTargetElement, setTooltipTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [crossRefAnnotations, setCrossRefAnnotations] = useState<Annotation[]>([])
  const [relatedAnnotations, setRelatedAnnotations] = useState<Annotation[]>([])

  const textWrapperRef = useRef<HTMLDivElement>(null)
  const flippedMatchedMapRef = useRef<MergedAnnotationEntry[]>(null)
  const selectedAnnotationRef = useRef<Annotation | null>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const hoveredAnnotationsRef = useRef<string[] | null>(null)
  const activeTargetRef = useRef<HTMLElement | null>(null)

  // Document object that is only recreated when htmlString changes - e.g. on item change or content type change
  const parsedDom: Element = React.useMemo(() => {
    if (htmlString === '') return
    const doc = new DOMParser().parseFromString(`${htmlString}`, 'text/html')
    return doc.querySelector('body')
  }, [htmlString])

  // Attach the content of the Document object as children of textWrapperRef.
  useEffect(() => {
    if (!parsedDom) return

    textWrapperRef.current.replaceChildren(parsedDom)
    if (onReady) onReady()
  }, [parsedDom])

  // Create and set matchedMap by identifying target nodes. Add listeners to targets.
  useEffect(() => {
    if (!parsedDom) return

    if (annotations) {
      const annotationsInText = annotations.filter(annotation => annotation.target?.[0].source === source)

      const result = annotations.reduce<MatchedAnnotationsMap>((acc, cur) => {
        if (!cur.target) return acc
        const isSource = cur.target[0].source === source
        const selector = (cur.target[0].selector as CssSelector)?.value

        if (!isSource || !selector) {
          if (!selector) console.error('Annotation error','Selector value of target is empty for this annotation', cur)
          return acc
        }

        const isCrossRefAnnotation = source.endsWith('.html') ? (cur.body as AnnotationBody)?.['x-content-type'] === 'CrossRef' : (cur.body as AnnotationBodyCrossRef)?.source?.['x-content-type'] === 'CrossRef'
        if (isCrossRefAnnotation) {
          Array.from(parsedDom.querySelectorAll(selector)).forEach(el => {
            addCrossRefTargetStyle(el)
          })
        }

        const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))

        if (matchedNodes.length > 0) {
          const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

          matchedNodes.forEach(target => {
            target.addEventListener('click', onClickTarget)
            target.addEventListener('mouseenter', onMouseEnterTarget)
            target.addEventListener('mouseleave', onMouseLeaveTarget)
          })

          const nestedAnnotations = getNestedAnnotations(cur, annotationsInText)

          acc[cur.id] = {
            target: matchedNodes,
            filtered: !selectedAnnotationTypes || ignoreFilters || isFiltered(cur, selectedAnnotationTypes, tooltipTypes),
            annotation: cur,
            nestedAnnotations
          }
        }
        return acc
      }, {})
      setMatchedMap(result)
      if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(result)

      flippedMatchedMapRef.current = flipMatchedAnnotationsMap(matchedMap)
      targetsRef.current = getTextTargets(flippedMatchedMapRef.current)
    }

    if (syncAnnotations) {
      const map = syncAnnotations.reduce((acc, cur) => {
        const target = cur.target.find(t => getSource(t).id === source)
        if (!target) return acc

        const selector = (target.selector as CssSelector)?.value
        const targets = Array.from(parsedDom.querySelectorAll(selector))

        if (!targets) return acc

        targets.forEach(target => {
          addSyncAnnotationId(target, cur.id)
          addAnnotationBaseStyle(target)
          addSyncHighlightStyle(target)
          target.addEventListener('mouseenter', onMouseEnterSyncTarget)
          target.addEventListener('mouseleave', onMouseLeaveSyncTarget)
        })

        acc[cur.id] = targets

        return acc
      }, {} as { [key: string]: Element[] })

      updateSyncMap(source, map)
    }

  }, [parsedDom, annotations, annotationsConfig])

  // Apply highlighting styles on every map update
  useEffect(() => {
    if (!matchedMap) return
    const flippedMatchedAnnotationsMap = flipMatchedAnnotationsMap(matchedMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMap)
    flippedMatchedMapRef.current = assignNestedTargetsInFlippedMatched(targetsRef.current, flippedMatchedAnnotationsMap)

    flippedMatchedMapRef.current.forEach(fa => {
      const annotations = fa.annotations
      const target = fa.target

      let someFiltered = false

      removeAnnotationIds(target)
      removeAnnotationBaseStyle(target)
      removeHighlightStyle(target)

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((annotation, i) => {
        if (fa.filtered[i]) {
          addAnnotationId(target, annotation.id)
          addAnnotationBaseStyle(target)
        }
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [matchedMap])

  // Update styles of targets if necessary on update of hoveredAnnotations
  useEffect(() => {
    if (!matchedMap) return
    hoveredAnnotationsRef.current = hoveredAnnotations
    const targetsOfHoveredAnnotations = getTargetsHoveredAnnotations(hoveredAnnotations, targetsRef.current, matchedMap)
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedMap[selectedAnnotation.id]) ?
      matchedMap[selectedAnnotation.id].target : []

    flippedMatchedMapRef.current?.forEach(fa => {
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
          addHoverStyle(target)
          if (hasParentHovered) {
            addNestedTargetStyle(target)
          }
        } else if (!partOfSelectedTargets(target, targetsOfSelectedAnnotation)) {
          addHighlightStyle(target)
        }
      }
    })
  }, [hoveredAnnotations])

  // Apply selected styles on every selectedAnnotation update
  useEffect(() => {
    if (!matchedMap) return

    selectedAnnotationRef.current = selectedAnnotation
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedMap[selectedAnnotation.id])
      ? matchedMap[selectedAnnotation.id].target
      : []

    if (!flippedMatchedMapRef.current) return

    flippedMatchedMapRef.current.forEach(fa => {
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

      if (partOfSelectedTargets(target, targetsOfSelectedAnnotation)) {
        addSelectedStyle(target)
        return
      } else if (someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [selectedAnnotation, matchedMap])

  useEffect(() => {
    const resultMap = { ...matchedMap }
    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
    if (selectedAnnotationTypes) {
      Object.keys(resultMap).forEach(id => {
        const { annotation } = resultMap[id]
        resultMap[id].filtered = isFiltered(annotation, selectedAnnotationTypes, tooltipTypes)
      })
    }

    setMatchedMap(resultMap)
    if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(resultMap)

  }, [selectedAnnotationTypes])

  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current)
    if (idsArray.length === 0) return

    setHoveredAnnotations(idsArray)
  }

  const onMouseLeaveTarget = (e: Event) => {
    // hoveredAnnotations can contain parent targets.
    // So on mouse leave, we want to remove the hover style only for the current target's annotation IDs.
    const target = e.currentTarget as HTMLElement
    const idsArray = getAnnotationIds(target)
    if (idsArray.length === 0) return

    setHoveredAnnotations(hoveredAnnotationsRef.current?.filter(a => !idsArray.includes(a)) ?? null)
  }


  const onClickTarget = async (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as Element
    const targetEntry: MergedAnnotationEntry = flippedMatchedMapRef.current.filter(entry => entry.target === target)[0]

    if (!containsChildren(targetsRef.current, target as HTMLElement)) {
      // handle only click events on 'deepest' target -> ignore click events on its containing targets while selection
      e.stopPropagation()
    }

    const crossRefAnnotations = annotations
      .filter(a => {
        const isInSource = a.target?.[0].source === source
        const isCrossRef = getAnnotationContentType(a) === annotationsConfig?.crossRefContentType
        return isInSource && isCrossRef
      })
      .filter(a => {
        const selector = (a.target[0].selector as CssSelector)?.value
        if (!selector) return false
        return Array.from(parsedDom.querySelectorAll(selector)).includes(target)
      })

    const crossRefContentType = annotationsConfig?.crossRefContentType
    const seen = new Set<string>()
    // compute related annotations: all annotations for the clicked target and its parent targets
    const newRelatedAnnotations = (flippedMatchedMapRef.current ?? [])
      .filter(entry => entry.target === target || entry.target.contains(target as HTMLElement))
      .flatMap(entry => entry.annotations)
      .filter(a => !seen.has(a.id) && seen.add(a.id) && getAnnotationContentType(a) !== crossRefContentType)

    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

    const normalAnnotations = tooltipTypes.length === 0
      ? newRelatedAnnotations
      : newRelatedAnnotations.filter(a => !tooltipTypes.includes((a.body as AnnotationBody)['x-content-type']))

    const openTooltip = !(normalAnnotations.length === 1 && newRelatedAnnotations.length === 1 && crossRefAnnotations.length === 0)

    if (openTooltip) {
      setTooltipOpen(true)
      setTooltipTargetElement(target as HTMLElement)
      setRelatedAnnotations(newRelatedAnnotations)
      if (target !== activeTargetRef.current)  addActiveTargetStyle(target)
    }

    setCrossRefAnnotations(crossRefAnnotations)

    // when we have only one normal annotation then we should select the annotation in Sidebar and not open tooltip. (select + deselect annotation)
    if (!openTooltip && normalAnnotations.length === 1) {
      // we need selectedAnnotationRef since the click listener has not an updated value of selectedAnnotation, it has the 'null' when it was initially created
      if (targetEntry.annotations[0].id === selectedAnnotationRef.current?.id) {
        setSelectedAnnotation(null)
        selectedAnnotationRef.current = null
      }
      else {
        setSelectedAnnotation(normalAnnotations[0])
        selectedAnnotationRef.current = normalAnnotations[0]
        if (onSelect) onSelect()
      }
    }

    activeTargetRef.current = target as HTMLElement
  }

  const onMouseEnterSyncTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getSyncAnnotationIds(target)
    if (idsArray.length === 0) return

    setHoveredSyncAnnotations(idsArray)
  }

  const onMouseLeaveSyncTarget = (e: Event) => {
    // hoveredAnnotations can contain parent targets.
    // So on mouse leave, we want to remove the hover style only for the current target's annotation IDs.
    const target = e.currentTarget as HTMLElement
    const idsArray = getSyncAnnotationIds(target)
    if (idsArray.length === 0) return
    setHoveredSyncAnnotations(null)
  }

  const closeTooltip = () => {
    setTooltipOpen(false)
    setTooltipTargetElement(null)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
    setHoveredAnnotations([])
    removeActiveTargetStyle(activeTargetRef.current)
    activeTargetRef.current = null
  }

  return <div data-text-wrapper ref={textWrapperRef} className={`relative ${paddingTop ? 'pt-16' : 'pt-2'}`}>
    <AnnotationPopoverContainer
      target={tooltipTargetElement}
      wrapper={textWrapperRef.current}
      open={tooltipOpen}
      onClose={closeTooltip}>
      <AnnotationPopoverContent
        crossRefAnnotations={crossRefAnnotations}
        relatedAnnotations={relatedAnnotations}
        onClose={closeTooltip}
      />
    </AnnotationPopoverContainer>
  </div>
})

export default GenericTextRenderer
