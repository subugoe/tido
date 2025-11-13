import { FC, forwardRef, ReactNode, useEffect, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/AnnotationsList.tsx'
import EmptyAnnotations from '@/components/panel/annotations/EmptyAnnotations.tsx'
import AnnotationsError from '@/components/panel/annotations/AnnotationsError.tsx'

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

  useEffect(() => {
    if (!scrollContainer.current) return
    const scroller = getSidebarScroller()
    scroller.setSidebar(scrollContainer.current)
    scroller.start()

    return () => {
      scroller.stop()
    }
  }, [scrollContainer])

  if (annotationsError) return <Container ref={scrollContainer}>
    <AnnotationsError error={annotationsError} />
  </Container>

  if (Object.keys(matchedAnnotationsMap).length === 0) return <Container ref={scrollContainer}>
    <EmptyAnnotations />
  </Container>

  return <Container ref={scrollContainer}>
    { annotationsMode === 'align' && <AlignAnnotationsList /> }
    { annotationsMode === 'list' && <AnnotationsList /> }
  </Container>
}

export default AnnotationsView
