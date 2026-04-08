import React, { FC, useEffect, useRef, useState } from 'react'
import {
  addAnnotationId, addHighlightStyle,
  addHoverStyle,
  addNestedTargetStyle,
  flipMatchedAnnotationsMap,
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
import { createMatchedAnnotationsMap, isFiltered } from '@/utils/annotations.ts'
import { useText } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString?: string,
  onReady?: () => void,
  selectedAnnotationTypes?: AnnotationTypesDict,
  updateMatchedAnnotationsMap?: (newMatchedAnnotationsMap: object) => void,
  annotations: Annotation[],
  source: string,
  onClickTarget?: (e: Event) => void,
  onMouseLeaveTarget?: (e: Event) => void,
  isAnnotation: boolean
}
const GenericTextRenderer: FC<Props> = ({ htmlString, onReady, updateMatchedAnnotationsMap, annotations, source, isAnnotation
  , selectedAnnotationTypes, onClickTarget, onMouseLeaveTarget }) => {

  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const { selectedAnnotation, panelId } = usePanel()

  const [portals, setPortals] = useState([])
  const textWrapperRef = useRef<HTMLDivElement>(null)


  const flippedMatchedAnnotationsMapRef = useRef<MergedAnnotationEntry[]>(null)
  const matchedAnnotationsMapRef = useRef<MatchedAnnotationsMap>(null)
  const targetsRef = useRef<HTMLElement[]>(null)


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
    if (onReady) onReady()
  }, [parsedDom])


  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current)
    if (idsArray.length === 0) return

    setHoveredAnnotations(idsArray)
  }

  useEffect(() => {
    // get all targets of hoveredAnnotations
    // get all targets of selectedAnnotations
    // if necessary update styles of targets

    const matchedAnnotationsMap = matchedAnnotationsMapRef.current

    if (!matchedAnnotationsMap) return
    const panelEl = document.getElementById(panelId)
    const targetsOfHoveredAnnotations = getTargetsHoveredAnnotations(hoveredAnnotations, targetsRef.current, matchedAnnotationsMap)
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedAnnotationsMap[selectedAnnotation.id]) ?
      matchedAnnotationsMap[selectedAnnotation.id].target.map((selector) => panelEl.querySelector(selector)) : []

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
      if (newMap.hasOwnProperty(annotation.id)) newMap[annotation.id].filtered = !selectedAnnotationTypes || isFiltered(annotation, selectedAnnotationTypes)
    })
    return newMap
  }


  // Create and set matchedAnnotationsMap by identifying target nodes. Add click listeners to targets.
  useEffect(() => {
    if (!annotations || !parsedDom) return

    let matchedAnnotationsMap: MatchedAnnotationsMap = {}

    const annotationsInText = annotations.filter(annotation => annotation.target[0].source === source)
    matchedAnnotationsMap = createMatchedAnnotationsMap(annotationsInText, isAnnotation)
    matchedAnnotationsMapRef.current = matchedAnnotationsMap

    if (!isAnnotation) matchedAnnotationsMap = assignFilteredInMap(matchedAnnotationsMap, selectedAnnotationTypes, annotations)
    flippedMatchedAnnotationsMapRef.current = flipMatchedAnnotationsMap(matchedAnnotationsMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMapRef.current)


    annotations.forEach((annotation) => {
      const isSource = annotation.target[0].source === source
      const selector = (annotation.target[0].selector as CssSelector)?.value

      if (!isSource || !selector) {
        if (!selector) console.error('Annotation error','Selector value of target is empty for this annotation', annotation)
        return
      }

      const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))

      if (matchedNodes.length > 0) {
        matchedNodes.forEach(target => {
          addAnnotationId(target, annotation.id)
          target.addEventListener('click', onClickTarget)
          target.addEventListener('mouseenter', onMouseEnterTarget)
          target.addEventListener('mouseleave', onMouseLeaveTarget)
        })
      }})

    if (!isAnnotation) updateMatchedAnnotationsMap(matchedAnnotationsMap)
  }, [parsedDom, annotations])


  return <div ref={textWrapperRef}>
    {portals}
  </div>
}

export default GenericTextRenderer
