import React, { FC, useRef, useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Annotation from '@/components/panel/annotations/sidebar/Annotation.tsx'
import { useTranslation } from 'react-i18next'

interface Props {
  nestedAnnotations: Annotation[],
  showExpanded: boolean,
  onToggle?: (annotation: Annotation) => void
  onExpand?: () => void,
  onCollapse?: () => void
}

const AnnotationFooter: FC<Props> = ({ nestedAnnotations, showExpanded, onToggle, onExpand, onCollapse }) => {

  const [expanded, setExpanded] = useState(false)
  const nestedAnnotationsRef = useRef(null)
  const { t } = useTranslation()

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setExpanded(!expanded)
    if (!expanded) return
    onCollapse()
  }

  useEffect(() => {
    setExpanded(showExpanded)
  }, [showExpanded])

  useEffect(() => {
    if (expanded) onExpand()
  }, [expanded])


  return <div className="w-full h-fit flex flex-col border-t border-border bg-muted cursor-pointer">
    <div className="flex footer-stripe pr-4 py-1 items-center justify-end text-xs text-muted-foreground" onClick={(e) => handleClick(e)}>
      <span className="p-0.5">{nestedAnnotations.length} {nestedAnnotations.length > 1 ? t('nested_annotations') : t('nested_annotation')}</span>
      <span className="mt-0.5">{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
    </div>
    {expanded && <div className="nested-annotations pl-4  mt-2 flex flex-col gap-1 w-full h-fit" ref={nestedAnnotationsRef}>
      {nestedAnnotations.map((annotation) => <Annotation key={annotation.id} data={annotation} isNested={true} onToggle={onToggle} />)}
    </div>
    }
  </div>
}

export default AnnotationFooter
