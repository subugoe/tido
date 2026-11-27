import { FC, forwardRef, ReactNode, useEffect, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/views/annotations/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/views/annotations/AnnotationsList.tsx'
import EmptyAnnotations from '@/components/panel/views/annotations/EmptyAnnotations.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'

interface ContainerProps {
  children?: ReactNode
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children }, ref) => {
  // The gutter has to stay reserved whether or not the list currently overflows. The cards are
  // absolutely positioned, so the list only overflows once their top values are committed - i.e.
  // after trackTopChange has already measured their heights. With `auto` alone the scrollbar would
  // appear at that point, narrow the content box and re-wrap every card one line taller than the
  // height the stacking math was based on.
  // The toolbar of the view stands above this container (see AnnotationsViewHeader), the list scrolls below it.
  return <div
    ref={ref}
    data-annotations-scroll-container
    className="relative flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable] px-3 bg-muted/60"
  >
    { children }
  </div>
})
const AnnotationsViewContent: FC = () => {
  const { annotationsError, annotationsMode, getScroller } = usePanel()
  const { filteredAnnotations } = useAnnotations()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { showBoundary } = useErrorBoundary()

  if (annotationsError) showBoundary(annotationsError)

  // The scroller only has to know which element the annotations view is. Whether it is actually synced with
  // the text is the aligned list's business - it starts that sync on mount and stops it on unmount.
  useEffect(() => {
    if (!scrollContainer.current) return
    getScroller().setAnnotations(scrollContainer.current)
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

export default AnnotationsViewContent
