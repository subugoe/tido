import React, { FC, memo, useEffect, useRef, useState } from 'react'
import {
  addAnnotationBaseStyle,
  addAnnotationId, addCrossRefTargetStyle,
  addHighlightStyle,
  addHoverStyle,
  addNestedTargetStyle,
  addSelectedStyle,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  isTargetPartOfSelectedAnnotation,
  removeAnnotationBaseStyle,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeNestedTargetStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import { computeNewSelectedAnnotationIndex, getNestedAnnotations, isFiltered } from '@/utils/annotations.ts'
import { useText } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { containsChildren } from '@/utils/text.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import TargetTooltip from '@/components/panel/TargetTooltip.tsx'
import { apiRequest } from '@/utils/api.ts'

interface Props {
  htmlString?: string
  onReady?: () => void
  onUpdateMatchedAnnotationsMap?: (map: MatchedAnnotationsMap) => void
  source: string
  onSelect?: () => void
  ignoreFilters?: boolean
}
const GenericTextRenderer: FC<Props> = memo(({
  htmlString,
  onReady,
  onUpdateMatchedAnnotationsMap,
  source,
  onSelect,
  ignoreFilters = false
}) => {
  const { annotations: annotationsConfig } = useConfig()
  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const { selectedAnnotation, selectedAnnotationTypes, setSelectedAnnotation, annotations } = usePanel()
  const [matchedMap, setMatchedMap] = useState<MatchedAnnotationsMap>({})

  const [tooltipAnnotation, setTooltipAnnotation] = useState<Annotation | null>(null)
  const [tooltipTargetElement, setTooltipTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [crossRefInfo, setCrossRefInfo] = useState<CrossRefInfo | null>(null)

  const textWrapperRef = useRef<HTMLDivElement>(null)
  const flippedMatchedMapRef = useRef<MergedAnnotationEntry[]>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const prevClickedTargetIndexRef = useRef<number>(null)
  const hoveredAnnotationsRef = useRef<string[] | null>(null)

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
    if (!annotations || !parsedDom) return
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
        if (annotations.length === 1) {
          if ((annotations[0].body as AnnotationBodyCrossRef)?.source?.['x-content-type'] === 'CrossRef') {
            addCrossRefTargetStyle(target)
          }
        }
        else {
          addHighlightStyle(target)
        }

      }
    })
  }, [matchedMap])

  // Update styles of targets if necessary on update of hoveredAnnotations
  useEffect(() => {
    if (!matchedMap) return
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
        } else if (!isTargetPartOfSelectedAnnotation(target, targetsOfSelectedAnnotation)) {
          addHighlightStyle(target)
        }
      }
    })
  }, [hoveredAnnotations])

  // Apply selected styles on every selectedAnnotation update
  useEffect(() => {
    if (!matchedMap) return

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

      if (isTargetPartOfSelectedAnnotation(target, targetsOfSelectedAnnotation)) {
        addSelectedStyle(target)
        return
      } else if(someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [selectedAnnotation, matchedMap])

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
    const annotIds = getAnnotationIds(target)
    const idsArray = annotIds?.split(',')
    if (idsArray?.length === 0) return

    setHoveredAnnotations(hoveredAnnotationsRef.current?.filter(a => !idsArray.includes(a)) ?? null)
  }

  async function getCrossRefInfo(annotation: Annotation) {
    // annotation: CrossRefAnnotation which contains the cross ref data, from which we extract the desired information


    const isCrossRefInAnnotation = !annotation?.target[0]?.source.endsWith('.html')

    const body = annotation.body as AnnotationBodyCrossRef
    const source = body.source
    const refItem = source.item
    const refItemData = await apiRequest<Item>(refItem)
    const refAnnotationId = isCrossRefInAnnotation ? source?.id : null
    let refAnnotation


    let contentUrl: string
    if (isCrossRefInAnnotation)  {
      const annotationCollection = await apiRequest<AnnotationCollection>(refItemData.annotationCollection)
      const annotationPage = await apiRequest<AnnotationPage>(annotationCollection.first)
      refAnnotation = annotationPage.items.find(annotation => annotation.id === refAnnotationId)
      contentUrl = refAnnotation.target[0].source
    }

    if (!isCrossRefInAnnotation) contentUrl = annotation.body?.source?.id

    // TODO: In Popover show error when refAnnotation is not found, due to error in CrossRef Information
    const refContentType = refItemData.content.find(c => c.url === contentUrl).type?.split('type=')[1]

    return {
      collection: source.collection,
      manifest: source.manifest,
      item: source.item,
      contentType: refContentType,
      annotationId: refAnnotationId,
      ...(isCrossRefInAnnotation && { selectedAnnotation: refAnnotation }),
      ...(!isCrossRefInAnnotation && { selector: (annotation.body as AnnotationBodyCrossRef)?.selector?.value }),
      refItemData
    }
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


    const crossRefAnnotation = annotations
      .filter(a => {
        const isInSource = a.target[0].source === source
        const isCrossRef = source.endsWith('.html')
          ? (a.body as AnnotationBodyCrossRef)?.['x-content-type'] === 'CrossRef'
          : (a.body as AnnotationBodyCrossRef)?.source?.['x-content-type'] === 'CrossRef'
        return isInSource && isCrossRef
      })
      .find(a => {
        const selector = (a.target[0].selector as CssSelector)?.value
        if (!selector) return false
        return Array.from(parsedDom.querySelectorAll(selector)).includes(target)
      })

    console.log('cross ref annotation', crossRefAnnotation)

    if (crossRefAnnotation) {
      const crossRefInfo = await getCrossRefInfo(crossRefAnnotation)
      setCrossRefInfo(crossRefInfo)
      setTooltipTargetElement(target as HTMLElement)
      setTooltipOpen(true)
    }

    const idsValue = getAnnotationIds(target)
    if (!idsValue) return

    targetEntry.selectedAnnotationIndex = computeNewSelectedAnnotationIndex(targetEntry, prevClickedTargetIndexRef.current, flippedMatchedMapRef.current)

    const annotation = targetEntry.selectedAnnotationIndex !== -1 ? targetEntry.annotations[targetEntry.selectedAnnotationIndex] : null

    if (annotation) {
      const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
      const contentType = (annotation.body as AnnotationBody)['x-content-type']

      if (tooltipTypes.includes(contentType)) {
        setTooltipAnnotation(annotation)
        setTooltipTargetElement(target as HTMLElement)
        setTooltipOpen(true)
      } else {
        setSelectedAnnotation(annotation)
        prevClickedTargetIndexRef.current = flippedMatchedMapRef.current.findIndex(entry => targetEntry === entry)
        if (onSelect) onSelect()
      }
    } else {
      setSelectedAnnotation(null)
    }
  }

  const closeTooltip = () => {
    setTooltipAnnotation(null)
    setTooltipTargetElement(null)
    setTooltipOpen(false)
    setHoveredAnnotations([])
  }

  return <div data-text-wrapper ref={textWrapperRef} className="relative">
    <TargetTooltip annotation={tooltipAnnotation} targetElement={tooltipTargetElement} open={tooltipOpen} onClose={closeTooltip} crossRefInfo={crossRefInfo} />
  </div>
})

export default GenericTextRenderer
