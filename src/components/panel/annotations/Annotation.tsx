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
import { ChevronDown, ChevronUp } from 'lucide-react'

const THRESHOLD_LONG_ANNOTATION_BODY_HEIGHT = 72

interface Props {
  data: Annotation
  top?: number,
  onToggle?: (annotation: Annotation) => void
  isNested?: boolean
}


const Annotation: FC<Props> = React.memo(({ data, top, onToggle, isNested = false }) => {
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

  const { t } = useTranslation()

  const type = annotationsConfig?.types?.[data.body['x-content-type']] ?? data.body['x-content-type']

  useEffect(() => {
    setIsHovered(hoveredAnnotations?.includes(data.id))
  }, [data, hoveredAnnotations])

  useEffect(() => {
    setIsSelected(selectedAnnotation && selectedAnnotation.id === data.id)
    const panelEl = document.getElementById(panelState.id) as HTMLElement
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(nestedMatchedAnnotationsMap[selectedAnnotation.id]) ? nestedMatchedAnnotationsMap[selectedAnnotation.id].target.map((selector: string) => panelEl.querySelector(selector)) : []

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
    setIsHovered(hoveredNestedAnnotationIds?.includes(data.id))

    const selectorsHoveredAnnotations = hoveredNestedAnnotationIds?.flatMap(id =>
      nestedMatchedAnnotationsMap[id]?.target ?? []
    )

    const panelEl = document.getElementById(panelState.id) as HTMLElement
    const targetsOfSelectedAnnotation = selectedAnnotation &&
    !!(nestedMatchedAnnotationsMap[selectedAnnotation.id]) ? nestedMatchedAnnotationsMap[selectedAnnotation.id].target.map((selector: string) => panelEl.querySelector(selector)) : []

    const flippedNestedMatched = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
    Object.keys(flippedNestedMatched).forEach((targetSelector) => {
      const targetEl = panelEl.querySelector(targetSelector)
      if (targetEl) {
        removeHighlightStyle(targetEl)
        removeHoverStyle(targetEl)

        if (selectorsHoveredAnnotations?.includes(targetSelector)) {
          addHoverStyle(targetEl)
        }
        else if (!isTargetPartOfSelectedAnnotation(targetEl, targetsOfSelectedAnnotation)) {
          addHighlightStyle(targetEl)
        }
      }
    })
  }, [hoveredNestedAnnotationIds])


  function onClickTarget(e: Event) {
    // expand parentAnnotation of target when clicking it
    //  clicking at a target -> expands the nested annotations
    //    -> since the nested annotations are expanded, then we show the full parent annotation
    //      -> reason: makes easier the functionality of showing another selected target when clicking at another nested annotation whose target is not initially shown in parentAnnotation
    setIsExpanded(true)

    const nestedAnnotations = nestedAnnotationsRef.current
    if (nestedAnnotations && nestedAnnotations.length > 0) {
      // from flippedMatchedAnnotationsMap select its first nested annotation
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

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    // we should get the deepest level annotation as selected
    e.stopPropagation()

    // when clicking target inside an Annotation -> we have two click events (on Target and onAnnotation)
    // this function considers click on Annotation
    // if we have clicked a target -> we should not proceed further in its parentAnnotation, also in this function
    const clickedEl = e.target
    const flippedMatchedAnnotationsMap = getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap)
    if (Object.values(flippedMatchedAnnotationsMap).some((entry) => entry.el === clickedEl)) return

    if (selectedAnnotation && selectedAnnotation.id === data.id) {
      setIsSelected(false)
      setTimeout(() => setSelectedAnnotation(null), 100)
      return
    }

    setIsSelected(true)
    setTimeout(() => setSelectedAnnotation(data), 100)
  }

  function handleMouseEnter() {
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

  function expandNestedAnnotations() {
    setIsExpanded(true)
    setShowNestedAnnotations(true)
    if (onToggle) onToggle(data)
  }

  function collapseNestedAnnotations() {
    setShowNestedAnnotations(false)
    if (onToggle) onToggle(data)
  }


  function handleViewMore(e: React.MouseEvent) {
    e.stopPropagation()
    setIsExpanded(true)
    if (onToggle) onToggle(data)
  }

  function handleViewLess(e: React.MouseEvent) {
    e.stopPropagation()
    setIsExpanded(false)
    if (onToggle) onToggle(data)
  }


  return <div
    ref={ref}
    aria-label="annotation"
    data-annotation={data.id}
    {...(isSelected ? { 'data-selected': true } : {})}
    className={` flex flex-col pt-2 rounded-lg border border-border h-fit overflow-x-hidden transition-[top]
      ${annotationsMode === 'aligned' && !isNested ? 'absolute' : 'mb-2'}
      ${annotationsMode === 'aligned' ? 'w-[calc(100%-1.3rem)]': !isNested ? 'w-[100%]': 'w-[calc(100%-0.3rem)]' }
      ${isSelected ? 'shadow-md bg-background outline-primary outline-2' : 'bg-muted border-border hover:bg-background cursor-pointer'}
      ${isHovered ? 'border-primary' : ''}`}
    onClick={handleClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{ top }}
  >
    <div className="px-3 pb-2">
      <Badge variant="accent" className="mb-1">{ type }</Badge>
      <div ref={annotationBodyRef} className={`transition-[height] duration-400 ease-in-out ${isLong && !isExpanded ? 'h-18 overflow-y-hidden' : 'h-fit'}`}  >
        { type === 'Variant' && <VariantContent body={data.body} /> }
        { type !== 'Variant' && <AnnotationContent body={data.body} /> }
      </div>
      { isLong && !isExpanded && <Button className="mt-2 text-sm gap-1" size='xs' variant="ghostPrimary" onClick={(e) => handleViewMore(e)} >
        {t('view_more')}
        <ChevronDown size={14} /></Button> }
      { isLong && isExpanded && <Button className="mt-2 text-sm gap-1" size='xs' variant="ghostPrimary" onClick={(e) => handleViewLess(e)} >{t('view_less')} <ChevronUp size={14} /></Button> }
    </div>
    { nestedAnnotationsRef.current?.length > 0 && <AnnotationFooter nestedAnnotations={nestedAnnotationsRef.current} onToggle={onToggle} showExpanded={showNestedAnnotations} onExpand={expandNestedAnnotations} onCollapse={collapseNestedAnnotations} /> }
  </div>
})

export default Annotation
