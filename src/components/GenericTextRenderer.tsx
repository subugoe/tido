import React, { FC, useEffect, useRef, useState } from 'react'
import {
  addAnnotationId, addHighlightStyle,
  addHoverStyle,
  addNestedTargetStyle,
  flipMatchedAnnotationsMap, getAnnotationIds,
  getHoveredAnnotationsIds,
  getRootCrossRefElements,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  isTargetPartOfSelectedAnnotation,
  removeHighlightStyle,
  removeHoverStyle,
  removeNestedTargetStyle
} from '@/utils/text.ts'
import { createPortal } from 'react-dom'
import CrossRefLink from '@/components/panel/CrossRef/CrossRefLink.tsx'
import {
  computeNewSelectedAnnotationIndex,
  getNestedAnnotations,
  isFiltered
} from '@/utils/annotations.ts'
import { useText } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { containsChildren } from '@/utils/text.ts'
import CrossRefAnnotation from '@/components/panel/CrossRef/CrossRefAnnotation.tsx'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'

interface Props {
  htmlString?: string,
  onReady?: () => void,
  selectedAnnotationTypes?: AnnotationTypesDict,
  updateMatchedAnnotationsMap?: (newMatchedAnnotationsMap: object) => void,
  annotations: Annotation[],
  source: string,
  onTargetClick?: () => void,
  onMouseLeaveTarget?: (e: Event) => void,
  isAnnotation: boolean
}
const GenericTextRenderer: FC<Props> = ({ htmlString, onReady, updateMatchedAnnotationsMap, annotations, source, isAnnotation
  , selectedAnnotationTypes, onTargetClick ,onMouseLeaveTarget }) => {

  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const { selectedAnnotation, setSelectedAnnotation } = usePanel()
  const [portals, setPortals] = useState([])


  const textWrapperRef = useRef<HTMLDivElement>(null)
  const flippedMatchedAnnotationsMapRef = useRef<MergedAnnotationEntry[]>(null)
  const matchedAnnotationsMapRef = useRef<MatchedAnnotationsMap>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const prevClickedTargetIndexRef = useRef<number>(null)


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
      const crossRefComp = !isAnnotation ? <CrossRefLink node={link as HTMLElement} /> : <CrossRefAnnotation nodeLink={link as HTMLElement}  />
      return createPortal(crossRefComp, mount)
    }))

    textWrapperRef.current.replaceChildren(parsedDom)
    if (onReady) onReady()
  }, [parsedDom])


  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current)
    if (idsArray.length === 0) return
    setHoveredAnnotations(idsArray)
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
      setSelectedAnnotation(annotation)
      prevClickedTargetIndexRef.current = flippedMatchedAnnotationsMapRef.current.findIndex(entry => targetEntry === entry)
      if (onTargetClick) onTargetClick()
    }
    else {
      setSelectedAnnotation(null)
    }
  }


  useEffect(() => {
    // get all targets of hoveredAnnotations
    // get all targets of selectedAnnotations
    // if necessary update styles of targets

    const matchedAnnotationsMap = matchedAnnotationsMapRef.current

    if (!matchedAnnotationsMap) return
    const targetsOfHoveredAnnotations = getTargetsHoveredAnnotations(hoveredAnnotations, targetsRef.current, matchedAnnotationsMap)
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedAnnotationsMap[selectedAnnotation.id]) ?
      matchedAnnotationsMap[selectedAnnotation.id].target : []

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


  function assignFilteredInMap(matchedMap: MatchedAnnotationsMap, selectedAnnotationTypes: AnnotationTypesDict, annotations: Annotation[]) {
    const newMap = { ...matchedMap }
    annotations.forEach((annotation) => {
      if (Object.prototype.hasOwnProperty.call(newMap, annotation.id)) newMap[annotation.id].filtered = !selectedAnnotationTypes || isFiltered(annotation, selectedAnnotationTypes)
    })
    return newMap
  }

  // Create and set matchedAnnotationsMap by identifying target nodes. Add click listeners to targets.
  useEffect(() => {
    if (!annotations || !parsedDom) return

    const annotationsInText = annotations.filter(annotation => annotation.target[0].source === source)

    let matchedAnnotationsMap: MatchedAnnotationsMap = {}
    annotations.forEach((annotation) => {
      const isSource = annotation.target[0].source === source
      const selector = (annotation.target[0].selector as CssSelector)?.value

      if (!isSource || !selector) {
        if (!selector) console.error('Annotation error','Selector value of target is empty for this annotation', annotation)
        return
      }

      const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))

      const nestedAnnotations = getNestedAnnotations(annotation, annotationsInText)
      matchedAnnotationsMap[annotation.id] = {
        nestedAnnotations,
        target: matchedNodes,
        annotation
      }
      if (isAnnotation) matchedAnnotationsMap[annotation.id].filtered = true

      if (matchedNodes.length > 0) {
        matchedNodes.forEach(target => {
          addAnnotationId(target, annotation.id)
          target.addEventListener('click', onClickTarget)
          target.addEventListener('mouseenter', onMouseEnterTarget)
          target.addEventListener('mouseleave', onMouseLeaveTarget)
        })
      }})

    if (!isAnnotation) matchedAnnotationsMap = assignFilteredInMap(matchedAnnotationsMap, selectedAnnotationTypes, annotations)
    matchedAnnotationsMapRef.current = matchedAnnotationsMap
    flippedMatchedAnnotationsMapRef.current = flipMatchedAnnotationsMap(matchedAnnotationsMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMapRef.current)

    if (!isAnnotation) updateMatchedAnnotationsMap(matchedAnnotationsMap)
  }, [parsedDom, annotations])


  return <div ref={textWrapperRef}>
    {portals}
  </div>
}

export default GenericTextRenderer
