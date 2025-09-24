import React, { FC, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import AnnotationContent from '@/components/panel/annotations/AnnotationContent.tsx'
import VariantContent from '@/components/panel/annotations/VariantContent.tsx'

interface Props {
  data: Annotation
  top?: number
}


const Annotation: FC<Props> = React.memo(({ data, top }) => {
  const {  setHoveredAnnotation, selectedAnnotation, setSelectedAnnotation, annotationsMode } = usePanel()
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const type = data.body['x-content-type']
  const value = data.body.value
  
  function handleClick() {
    setSelectedAnnotation(data)
  }

  function handleMouseEnter() {
    setIsHovered(true)
    setTimeout(() => {
      setHoveredAnnotation(data.id)
    }, 100)
  }
  function handleMouseLeave() {
    setIsHovered(false)
    setTimeout(() => {
      setHoveredAnnotation(null)
    }, 100)
  }

  function isSelected() {
    return selectedAnnotation && selectedAnnotation.id === data.id
  }

  return <>
    <div
      ref={ref}
      data-annotation={data.id}
      {...(isSelected() ? { 'data-selected': true } : {})}
      className={`w-[calc(100%-2rem)] flex flex-col px-3 py-2 rounded-lg border border-border
      ${annotationsMode === 'align' ? 'absolute' : 'mb-2'}
      ${isSelected() ? 'shadow-md bg-background outline-primary outline-2' : 'bg-accent border-border hover:bg-background cursor-pointer'}
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
