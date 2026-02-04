import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import AnnotationContent from '@/components/panel/annotations/AnnotationContent.tsx'
import VariantContent from '@/components/panel/annotations/VariantContent.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'

const DEFAULT_ANNOTATION_HEIGHT = 60


interface Props {
  data: Annotation
  top?: number,
  onToggle?: (annotationId: string, element, finalHeight, translateY) => void
}


const Annotation: FC<Props> = React.memo(({ data, top, onToggle }) => {
  const { selectedAnnotation, setSelectedAnnotation, annotationsMode } = usePanel()
  const { setHoveredAnnotations, hoveredAnnotations } = useText()
  const ref = useRef(null)
  const annotationBodyRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [isLong, setIsLong] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const { t } = useTranslation()

  const type = data.body['x-content-type']

  useEffect(() => {
    setIsHovered(hoveredAnnotations?.includes(data.id))
  }, [data, hoveredAnnotations])

  useEffect(() => {
    setIsSelected(selectedAnnotation && selectedAnnotation.id === data.id)
  }, [data, selectedAnnotation])

  useEffect(() => {
    if (!annotationBodyRef.current) return
    const annotBodyHeight = annotationBodyRef.current.clientHeight
    if (annotBodyHeight > DEFAULT_ANNOTATION_HEIGHT) setIsLong(true)
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


  function handleViewMore(e) {
    e.stopPropagation()
    setIsExpanded(true)
    // Step 1: Measure the expanded height
    // Temporarily apply h-fit to measure
    // Step 1: Get current collapsed height
    const annotationEl = ref.current
    const bodyEl = annotationBodyRef.current // we expand/collapse its content

    const collapsedHeight = annotationEl.offsetHeight

    // Step 1: Compute temporarily the new expanded height
    bodyEl.classList.remove('h-18', 'overflow-y-hidden')
    bodyEl.classList.add('h-fit')

    // Force reflow
    bodyEl.offsetHeight

    const expandedHeight = annotationEl.offsetHeight

    const translateY = expandedHeight - collapsedHeight


    // Step 2: Revert back to collapsed state (no visual change yet)
    bodyEl.classList.remove('h-fit', 'overflow-y-hidden')
    bodyEl.classList.add('h-18')


    console.log('top', annotationEl.top)
    console.log('collapsed height', collapsedHeight)
    console.log('expanded height', expandedHeight)
    console.log('translateY', translateY)

    console.log('on toggle', onToggle)
    if (onToggle) onToggle(data.id, bodyEl, expandedHeight, translateY)
  }

  function handleViewLess(e) {
    e.stopPropagation()
    setIsExpanded(false)
    //if (onToggle) onToggle()
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
      <div ref={annotationBodyRef} className={`${isLong && !isExpanded ? 'h-18 overflow-y-hidden' : 'h-fit'}`}  >
        <Badge variant="secondary" className="mb-1">{ type }</Badge>
        <div  className={`transition-[height] duration-400 ease-in-out`}>
          { type === 'Variant' && <VariantContent body={data.body} /> }
          { type !== 'Variant' && <AnnotationContent body={data.body} /> }
        </div>
      </div>
      { isLong && !isExpanded && <Button className="w-fit h-2 mt-4 px-0" variant="text" onClick={(e) => handleViewMore(e)} >{t('view_more')}</Button> }
      { isLong && isExpanded && <Button className="w-fit h-2 mt-4 px-0" variant="text" onClick={(e) => handleViewLess(e)} >{t('view_less')}</Button> }
    </div>
  </>
})

export default Annotation
