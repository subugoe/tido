import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import AnnotationContent from '@/components/panel/annotations/AnnotationContent.tsx'
import VariantContent from '@/components/panel/annotations/VariantContent.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'

import AnnotationFooter from '@/components/panel/annotations/AnnotationFooter.tsx'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'
import {
  addHighlightStyle,
  addHoverStyle, addSelectedStyle, isTargetPartOfSelectedAnnotation,
  removeHighlightStyle,
  removeHoverStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import {
  findTargetsInsideAnnotation,
  getAnnotationIdsByEl,
  getFlippedNestedMatchedAnnotationsMap
} from '@/utils/annotations.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const THRESHOLD_LONG_ANNOTATION_BODY_HEIGHT = 60
const DEFAULT_ANNOTATION_BODY_HEIGHT = 72



interface Props {
  data: Annotation
  top?: number,
  onExpand?: (annotationId: string, element: HTMLElement, finalHeight: number, translateY: number) => void
  onCollapse?: (element: HTMLElement, finalHeight: number) => void
  isNested?: boolean
}


const Annotation: FC<Props> = React.memo(({ data, top, onExpand, onCollapse, isNested = false }) => {
  const { annotations: annotationsConfig } = useConfig()
  const { selectedAnnotation, setSelectedAnnotation, annotationsMode, panelState } = usePanel()
  const { nestedMatchedAnnotationsMap, hoveredNestedAnnotationIds, setHoveredNestedAnnotationIds  } = useAnnotations()
  const { setHoveredAnnotations, hoveredAnnotations } = useText()
  const ref = useRef(null)
  const annotationBodyRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [isLong, setIsLong] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showNestedAnnotations, setShowNestedAnnotations] = useState(false)


  const nestedAnnotationsRef = useRef(null)
  const clickedTargetRef = useRef(null)

  const collapsedBodyHeightRef = useRef(-1)
  const expandedBodyHeightRef = useRef(-1)

  const { t } = useTranslation()

  const type = annotationsConfig?.types?.[data.body['x-content-type']] ?? data.body['x-content-type']
  const panelEl = document.getElementById(panelState.id) as HTMLElement


  useEffect(() => {
    setIsHovered(hoveredAnnotations?.includes(data.id))
  }, [data, hoveredAnnotations])

  useEffect(() => {
    setIsSelected(selectedAnnotation && selectedAnnotation.id === data.id)

    const targetsOfSelectedAnnotation = selectedAnnotation && !!(nestedMatchedAnnotationsMap[selectedAnnotation.id]) ? nestedMatchedAnnotationsMap[selectedAnnotation.id].target.map((selector: string) => panelEl.querySelector(selector)) : []

    // remove all hover and selected styles of all targets
    const flippedNestedMatched = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
    Object.keys(flippedNestedMatched).forEach((targetSelector) => {
      const targetEl = document.querySelector(targetSelector)
      if (!targetEl) return

      removeSelectedStyle(targetEl)
      removeHighlightStyle(targetEl)

      if (isTargetPartOfSelectedAnnotation(targetEl, targetsOfSelectedAnnotation)) {
        addSelectedStyle(targetEl)
        return
      }
      else {
        addHighlightStyle(targetEl)
      }
    })
  }, [data, selectedAnnotation])

  useEffect(() => {
    const flippedNestedMatched = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
    Object.keys(flippedNestedMatched).forEach((targetSelector) => {
      const targetEl = document.querySelector(targetSelector)
      if (targetEl) {
        removeHighlightStyle(targetEl)
        removeHoverStyle(targetEl)
      }
    })

    setIsHovered(hoveredNestedAnnotationIds?.includes(data.id))

    const selectorsHoveredAnnotations = hoveredNestedAnnotationIds?.flatMap(id =>
      nestedMatchedAnnotationsMap[id]?.target ?? []
    )


    const targetsOfSelectedAnnotation = selectedAnnotation &&
    !!(nestedMatchedAnnotationsMap[selectedAnnotation.id]) ? nestedMatchedAnnotationsMap[selectedAnnotation.id].target.map((selector: string) => panelEl.querySelector(selector)) : []
    Object.keys(flippedNestedMatched).forEach((targetSelector) => {
      const targetEl = document.querySelector(targetSelector)
      if (targetEl && selectorsHoveredAnnotations?.includes(targetSelector)) {
        addHoverStyle(targetEl)
      }
      else if (targetEl && !isTargetPartOfSelectedAnnotation(targetEl, targetsOfSelectedAnnotation)) {
        addHighlightStyle(targetEl)
      }
    })
  }, [hoveredNestedAnnotationIds])


  function onClickTarget(e: Event) {
    // expand parentAnnotation of target when clicking it
    //  clicking at a target -> expands the nested annotations
    //    -> since the nested annotations are expanded, then we show the full parent annotation
    //      -> reason: makes easier the functionality of showing another selected target when clicking at another nested annotation whose target is not initially shown in parentAnnotation
    setIsExpanded(true)

    clickedTargetRef.current = e.target
    const nestedAnnotations = nestedAnnotationsRef.current
    if (nestedAnnotations && nestedAnnotations.length > 0) {
      // from flippedMatchedAnnotationsMap get its first nested annotation
      // update selectedAnnotation with the found annotation
      const flippedNestedMatchedAnnotationsMap = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
      const targetAnnotationIds = getAnnotationIdsByEl(flippedNestedMatchedAnnotationsMap, e.target as HTMLElement)
      // get the first nested annotation which belongs to the selected target
      for (let i = 0; i< nestedAnnotations.length; i++ ) {
        if (targetAnnotationIds.includes(nestedAnnotations[i].id)) {
          setShowNestedAnnotations(true)
          setSelectedAnnotation(nestedAnnotations[i])
          break
        }
      }
    }
  }

  function collapseNestedAnnotations() {
    setShowNestedAnnotations(false)
  }



  function onMouseEnterTarget(e: Event) {
    const flippedNestedMatchedAnnotationsMap = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
    const annotationIds = getAnnotationIdsByEl(flippedNestedMatchedAnnotationsMap, e.currentTarget as HTMLElement)
    // add hover style to annotation els
    setHoveredNestedAnnotationIds(annotationIds)
  }

  function onMouseLeaveTarget() {
    setHoveredNestedAnnotationIds([])
  }


  useEffect(() => {
    if (!annotationBodyRef.current) return
    const annotBodyHeight = annotationBodyRef.current.clientHeight
    if (annotBodyHeight > THRESHOLD_LONG_ANNOTATION_BODY_HEIGHT) setIsLong(true)

    nestedAnnotationsRef.current = nestedMatchedAnnotationsMap[data.id]['nestedAnnotations']

    // we add highlighting to annotations
    // for each new nested Annotation - we add highlighting once it is mounted.
    const itemAnnotations = panelState.annotations
    const targetsInsideAnnotation = findTargetsInsideAnnotation(data.id, itemAnnotations)
    targetsInsideAnnotation.forEach((selector) => {
      const target = document.querySelector(selector)
      if (target) {
        addHighlightStyle(target)
        target.addEventListener('click', onClickTarget)
        target.addEventListener('mouseenter', onMouseEnterTarget)
        target.addEventListener('mouseleave', onMouseLeaveTarget)
      }
    })
  }, [])

  function handleClick(e) {
    // we should get the deepest level annotation as selected
    e.stopPropagation()

    // when clicking target inside an Annotation -> we have two click events (on Target and onAnnotation)
    // this function considers click on Annotation
    // if we have clicked a target -> we should not proceed further in its parentAnnotation, also in this function
    const clickedEl = e.target
    const flippedMatchedAnnotationsMap = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
    if (Object.values(flippedMatchedAnnotationsMap).some((entry: object) => entry.el === clickedEl)) return

    if (selectedAnnotation && selectedAnnotation.id === data.id) {
      setIsSelected(false)
      setTimeout(() => setSelectedAnnotation(null), 100)
      return
    }

    setIsSelected(true)
    setTimeout(() => {
      setSelectedAnnotation(data)
    }, 100)
  }

  function handleMouseEnter() {
    setIsHovered(true)
    if (!data.target[0].source.endsWith('.html')) {
      setHoveredNestedAnnotationIds([data.id])
      return
    }
    setHoveredAnnotations([data.id])
  }

  function handleMouseLeave() {
    setIsHovered(false)
    setHoveredAnnotations(null)
    setHoveredNestedAnnotationIds(null)
  }

  function getExpandableInfoOnViewMore(bodyEl: HTMLElement) {
    let expandableElFinalHeight = 0
    const expandableEl = bodyEl
    if (collapsedBodyHeightRef.current === -1) {
      // initial height is the collapsed height
      collapsedBodyHeightRef.current = bodyEl.offsetHeight
    }

    if (expandedBodyHeightRef.current === -1) {
      // Step 1: Compute temporarily the new expanded height. This is done only once, when we expand for the first time
      bodyEl.classList.remove('h-18', 'overflow-y-hidden')
      bodyEl.classList.add('h-fit')

      // Force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      bodyEl.offsetHeight
      expandedBodyHeightRef.current = bodyEl.offsetHeight

      expandableElFinalHeight = expandedBodyHeightRef.current
    }
    else {
      expandableElFinalHeight = expandedBodyHeightRef.current
    }

    const translateY = expandedBodyHeightRef.current - collapsedBodyHeightRef.current

    // Step 2: Revert back to collapsed state (no visual change yet)
    if (expandedBodyHeightRef.current === -1) {
      bodyEl.classList.remove('h-fit')
      bodyEl.classList.add('h-18', 'overflow-y-hidden')
    }

    return {
      expandableEl,
      expandableElFinalHeight,
      translateY
    }
  }


  function expandAnnotation(e: React.MouseEvent<HTMLDivElement>, expandType: 'view-more' | 'nested-annotations',) {
    e?.stopPropagation()
    setIsExpanded(true)

    const bodyEl = annotationBodyRef.current

    // I need to have 3 things to pass to onAnnotationExpand
    // 1. expandableEl
    // 2. expandableElFinalHeight
    // 3. translateY -> how much the lower annotations should be pushed down

    if (expandType === 'view-more') {
      const { expandableEl, expandableElFinalHeight, translateY } = getExpandableInfoOnViewMore(bodyEl)
      if (onExpand) onExpand(data.id, expandableEl, expandableElFinalHeight, translateY)
    }
  }


  function handleViewMore(e: React.MouseEvent) {
    expandAnnotation(e, 'view-more')
  }

  function handleViewLess(e: React.MouseEvent) {
    e.stopPropagation()
    setIsExpanded(false)
    const bodyEl = annotationBodyRef.current // we collapse annotation body's content
    if (onCollapse) onCollapse(bodyEl, DEFAULT_ANNOTATION_BODY_HEIGHT)
  }

  return <div
    ref={ref}
    aria-label="annotation"
    data-annotation={data.id}
    {...(isSelected ? { 'data-selected': true } : {})}
    className={` flex flex-col pt-2 rounded-lg border border-border h-fit overflow-x-hidden
      ${annotationsMode === 'aligned' && !isNested ? 'absolute' : 'mb-2'}
      ${isSelected ? 'shadow-md bg-background outline-primary outline-2' : 'bg-muted border-border hover:bg-background cursor-pointer'}
       ${!isNested ? 'w-[calc(100%-0.5rem)]' : 'w-[calc(100%-0.2rem)]'}
      ${isHovered ? 'border-primary' : ''} transition-[height] duration-400 ease-in-out h-54 overflow-y-hidden`}
    onClick={handleClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{ top }}
  >
    <div className="px-3 pb-2">
      <div ref={annotationBodyRef} className={`transition-[height] duration-400 ease-in-out ${isLong && !isExpanded ? 'h-18 overflow-y-hidden' : 'h-fit'}`}  >
        <Badge variant="accent" className="mb-1">{ type }</Badge>
        { type === 'Variant' && <VariantContent body={data.body} /> }
        { type !== 'Variant' && <AnnotationContent body={data.body} /> }
      </div>
      { isLong && !isExpanded && <Button className="mt-4" size='sm' variant="ghostPrimary" onClick={(e) => handleViewMore(e)} >{t('view_more')}</Button> }
      { isLong && isExpanded && <Button className="mt-4" size='sm' variant="ghostPrimary" onClick={(e) => handleViewLess(e)} >{t('view_less')}</Button> }
    </div>
    { nestedAnnotationsRef.current?.length > 0 && <AnnotationFooter nestedAnnotations={nestedAnnotationsRef.current} showExpanded={showNestedAnnotations} onExpand={expandAnnotation} onCollapse={collapseNestedAnnotations} /> }
  </div>
})

export default Annotation
