import { FC, forwardRef, ReactNode, useEffect, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/sidebar/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/sidebar/AnnotationsList.tsx'
import EmptyAnnotations from '@/components/panel/annotations/sidebar/EmptyAnnotations.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'

interface ContainerProps {
  children?: ReactNode
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children }, ref) => {
  // The gutter has to stay reserved whether or not the sidebar currently overflows. The cards are
  // absolutely positioned, so the list only overflows once their top values are committed - i.e.
  // after trackTopChange has already measured their heights. With `auto` alone the scrollbar would
  // appear at that point, narrow the content box and re-wrap every card one line taller than the
  // height the stacking math was based on.
  return <div ref={ref} data-sidebar-scroll-container className="relative flex-1 overflow-y-auto [scrollbar-gutter:stable] px-3 bg-muted/60">
    { children }
  </div>
})
const AnnotationsView: FC = () => {
  const { annotationsError, annotationsMode, getScroller } = usePanel()
  const { filteredAnnotations } = useAnnotations()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { showBoundary } = useErrorBoundary()

  if (annotationsError) showBoundary(annotationsError)

  // The scroller only has to know which element the sidebar is. Whether it is actually synced with
  // the text is the aligned list's business - it starts that sync on mount and stops it on unmount.
  useEffect(() => {
    if (!scrollContainer.current) return
    getScroller().setSidebar(scrollContainer.current)
  }, [scrollContainer])

  function getContent() {
    if (filteredAnnotations.length === 0) return <EmptyAnnotations />
    if (annotationsMode === 'aligned') return <AlignAnnotationsList />
    if (annotationsMode === 'list') return <AnnotationsList />
  }

  return <Container ref={scrollContainer}>
    { getContent() }
  </Container>
}

export default AnnotationsView
