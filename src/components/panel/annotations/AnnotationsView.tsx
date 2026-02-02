import { FC, forwardRef, ReactNode, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/AnnotationsList.tsx'
import EmptyAnnotations from '@/components/panel/annotations/EmptyAnnotations.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import { getFilteredAnnotations } from '@/utils/annotations.ts'

interface ContainerProps {
  children?: ReactNode
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children }, ref) => {
  return <div ref={ref} className="relative flex-1 overflow-y-auto px-3 bg-muted">
    { children }
  </div>
})
const AnnotationsView: FC = () => {
  const { matchedAnnotationsMap, annotationsError, annotationsMode, getSidebarScroller } = usePanel()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { showBoundary } = useErrorBoundary()

  if (annotationsError) showBoundary(annotationsError)

  const [filteredAnnotations, setFilteredAnnotations] = useState([])

  useEffect(() => {
    if (!scrollContainer.current) return
    const scroller = getSidebarScroller()
    scroller.setSidebar(scrollContainer.current)
  }, [scrollContainer])

  useEffect(() => {
    const newFilteredAnnotations = getFilteredAnnotations(matchedAnnotationsMap)
    setFilteredAnnotations(newFilteredAnnotations)
  }, [matchedAnnotationsMap])


  function getContent() {
    if (Object.keys(matchedAnnotationsMap).length === 0) return <EmptyAnnotations />
    if (annotationsMode === 'aligned') return <AlignAnnotationsList filteredAnnotations={filteredAnnotations} />
    if (annotationsMode === 'list') return <AnnotationsList filteredAnnotations={filteredAnnotations} />
  }

  return <Container ref={scrollContainer}>
    { getContent() }
  </Container>
}

export default AnnotationsView
