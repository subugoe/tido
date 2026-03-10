import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import AnnotationContent from '@/components/panel/annotations/AnnotationContent.tsx'
import VariantContent from '@/components/panel/annotations/VariantContent.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const THRESHOLD_LONG_ANNOTATION_BODY_HEIGHT = 60
const DEFAULT_ANNOTATION_BODY_HEIGHT = 72


interface Props {
  data: Annotation
  top?: number,
  onExpand?: (annotationId: string, element: HTMLElement, finalHeight: number, translateY: number) => void
  onCollapse?: (element: HTMLElement, finalHeight: number) => void
}


const Annotation: FC<Props> = React.memo(({ data, top, onExpand, onCollapse }) => {
  const { annotations: annotationsConfig } = useConfig()
  const { selectedAnnotation, setSelectedAnnotation, annotationsMode } = usePanel()
  const { setHoveredAnnotations, hoveredAnnotations } = useText()
  const ref = useRef(null)
  const annotationBodyRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [isLong, setIsLong] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const expandedHeightRef = useRef(-1)
  const collapsedHeightRef = useRef(-1)

  const expandedBodyHeightRef = useRef(-1)

  const { t } = useTranslation()

  const type = annotationsConfig?.types?.[data.body['x-content-type']] ?? data.body['x-content-type']

  useEffect(() => {
    setIsHovered(hoveredAnnotations?.includes(data.id))
  }, [data, hoveredAnnotations])

  useEffect(() => {
    setIsSelected(selectedAnnotation && selectedAnnotation.id === data.id)
  }, [data, selectedAnnotation])

  useEffect(() => {
    if (!annotationBodyRef.current) return
    const annotBodyHeight = annotationBodyRef.current.clientHeight
    if (annotBodyHeight > THRESHOLD_LONG_ANNOTATION_BODY_HEIGHT) setIsLong(true)
  }, [])

  function handleClick() {
    if (selectedAnnotation && selectedAnnotation.id === data.id) {
      setIsSelected(false)
      setTimeout(() => setSelectedAnnotation(null), 100)
      return
    }

    setIsSelected(true)
    setTimeout(() => setSelectedAnnotation(data), 100)
  }

  function handleMouseEnter() {
    setIsHovered(true)
    setHoveredAnnotations([data.id])
  }

  function handleMouseLeave() {
    setIsHovered(false)
    setHoveredAnnotations(null)
  }


  function handleViewMore(e: React.MouseEvent) {
    e.stopPropagation()
    setIsExpanded(true)

    const annotationEl = ref.current
    const bodyEl = annotationBodyRef.current // we expand/collapse its content

    if (collapsedHeightRef.current === -1) {
      // initial height is the collapsed height
      collapsedHeightRef.current = annotationEl.offsetHeight
    }

    if (expandedBodyHeightRef.current === -1) {
      // Step 1: Compute temporarily the new expanded height. This is done only once, when we expand for the first time
      bodyEl.classList.remove('h-18', 'overflow-y-hidden')
      bodyEl.classList.add('h-fit')

      // Force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      bodyEl.offsetHeight
      expandedBodyHeightRef.current = bodyEl.offsetHeight
      expandedHeightRef.current = annotationEl.offsetHeight
    }

    const translateY = expandedHeightRef.current - collapsedHeightRef.current

    // Step 2: Revert back to collapsed state (no visual change yet)
    if (expandedBodyHeightRef.current === -1) {
      bodyEl.classList.remove('h-fit')
      bodyEl.classList.add('h-18', 'overflow-y-hidden')
    }

    if (onExpand) onExpand(data.id, bodyEl, expandedBodyHeightRef.current, translateY)
  }

  function handleViewLess(e: React.MouseEvent) {
    e.stopPropagation()
    setIsExpanded(false)
    const bodyEl = annotationBodyRef.current // we collapse annotation body's content
    if (onCollapse) onCollapse(bodyEl, DEFAULT_ANNOTATION_BODY_HEIGHT)
  }

  return <>
    <div
      ref={ref}
      aria-label="annotation"
      data-annotation={data.id}
      {...(isSelected ? { 'data-selected': true } : {})}
      className={`w-[calc(100%-2rem)] flex flex-col px-3 py-2 rounded-lg border border-border
      ${annotationsMode === 'aligned' ? 'absolute' : 'mb-2'}
      ${isSelected ? 'shadow-md bg-background outline-primary outline-2' : 'bg-muted border-border hover:bg-background cursor-pointer'}
      ${isHovered ? 'border-primary' : ''} transition-all `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ top }}
    >
      <div ref={annotationBodyRef} className={`transition-[height] duration-400 ease-in-out ${isLong && !isExpanded ? 'h-18 overflow-y-hidden' : 'h-fit'}`}  >
        <Badge variant="accent" className="mb-1">{ type }</Badge>
        { type === 'Variant' && <VariantContent body={data.body} /> }
        { type !== 'Variant' && <AnnotationContent body={data.body} /> }
      </div>
      { isLong && !isExpanded && <Button className="mt-4" size='sm' variant="ghostPrimary" onClick={(e) => handleViewMore(e)} >{t('view_more')}</Button> }
      { isLong && isExpanded && <Button className="mt-4" size='sm' variant="ghostPrimary" onClick={(e) => handleViewLess(e)} >{t('view_less')}</Button> }
    </div>
  </>
})

export default Annotation
