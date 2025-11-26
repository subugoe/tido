import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import AnnotationContent from '@/components/panel/annotations/AnnotationContent.tsx'
import VariantContent from '@/components/panel/annotations/VariantContent.tsx'
import { useText } from '@/contexts/TextContext.tsx'

interface Props {
  data: Annotation
  top?: number
}


const Annotation: FC<Props> = React.memo(({ data, top }) => {
  const { selectedAnnotation, setSelectedAnnotation, annotationsMode } = usePanel()
  const { setHoveredAnnotations, hoveredAnnotations } = useText()
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const type = data.body['x-content-type']
  const value = data.body.value

  useEffect(() => {
    setIsHovered(hoveredAnnotations?.includes(data.id))
  }, [data, hoveredAnnotations])

  useEffect(() => {
    setIsSelected(selectedAnnotation && selectedAnnotation.id === data.id)
  }, [data, selectedAnnotation])

  function handleClick() {
    if (selectedAnnotation && selectedAnnotation.id === data.id) {
      setIsSelected(false)
      setTimeout(() => setSelectedAnnotation(data), 100)
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

  return <>
    <div
      ref={ref}
      aria-label="annotation"
      data-annotation={data.id}
      {...(isSelected ? { 'data-selected': true } : {})}
      className={`w-[calc(100%-2rem)] flex flex-col px-3 py-2 rounded-lg border border-border
      ${annotationsMode === 'align' ? 'absolute' : 'mb-2'}
      ${isSelected ? 'shadow-md bg-background outline-primary outline-2' : 'bg-muted border-border hover:bg-background cursor-pointer'}
      ${isHovered ? 'border-primary' : ''} transition-all max-h-18 overflow-hidden`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ top }}
    >
      <Badge variant="secondary" className="mb-1">{ type }</Badge>
      { type === 'Variant' && <VariantContent value={value as AnnotationVariantValue} /> }
      { type !== 'Variant' && <AnnotationContent value={value as string} /> }
    </div>
  </>
})

export default Annotation
