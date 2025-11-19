import { FC, forwardRef, ReactNode, useEffect, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/AnnotationsList.tsx'
import EmptyAnnotations from '@/components/panel/annotations/EmptyAnnotations.tsx'
import AnnotationsError from '@/components/panel/annotations/AnnotationsError.tsx'
import Loading from '@/components/ui/loading.tsx'

interface ContainerProps {
  children?: ReactNode
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children }, ref) => {
  return <div ref={ref} className="relative flex-1 overflow-y-auto px-3 bg-muted">
    { children }
  </div>
})
const AnnotationsView: FC = () => {
  const { annotationsLoading, matchedAnnotationsMap, annotationsError, annotationsMode, getSidebarScroller } = usePanel()
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


  function getContent() {
    if (annotationsError) return <AnnotationsError error={annotationsError} />
    if (Object.keys(matchedAnnotationsMap).length === 0) return <EmptyAnnotations />
    if (annotationsMode === 'align') return <AlignAnnotationsList />
    if (annotationsMode === 'list') return <AnnotationsList />
  }

  return <Container ref={scrollContainer}>
    { getContent() }
    { annotationsLoading && <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading size={36} />
    </div> }
  </Container>
}

export default AnnotationsView
