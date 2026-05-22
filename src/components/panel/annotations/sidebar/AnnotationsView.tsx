import { FC, forwardRef, ReactNode, useEffect, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/sidebar/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/sidebar/AnnotationsList.tsx'
import EmptyAnnotations from '@/components/panel/annotations/sidebar/EmptyAnnotations.tsx'
import { useErrorBoundary } from 'react-error-boundary'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { useAnnotations } from '@/contexts/AnnotationsContext.tsx'
import { getSource } from '@/utils/annotations.ts'

interface ContainerProps {
  children?: ReactNode
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children }, ref) => {
  return <div ref={ref} className="relative flex-1 overflow-y-auto px-3 bg-muted">
    { children }
  </div>
})
const AnnotationsView: FC = () => {
  const { annotationsError, annotationsMode, selectedAnnotation, getScroller } = usePanel()
  const { filteredAnnotations } = useAnnotations()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const { showBoundary } = useErrorBoundary()

  if (annotationsError) showBoundary(annotationsError)

  useEffect(() => {
    if (!scrollContainer.current) return
    const scroller = getScroller()
    scroller.setSidebar(scrollContainer.current)
    scroller.startSidebar()
    return () => scroller.stopSidebar()
  }, [scrollContainer])

  useEffect(() => {
    if (!selectedAnnotation) return
    const scroller = getScroller()
    if (annotationsMode === 'aligned' && selectedAnnotation.origin === 'text') {
      const { contentUrl } = selectedAnnotation
      // we need to wait till annotations are added to sidebar AND overflow has happened
      console.log('sidebar height', scroller.sidebar.scrollHeight)
      const rafId = requestAnimationFrame(() => {
        scroller.syncSidebarToText(contentUrl)

        console.log('scrollHeight', scroller.sidebar.scrollHeight)  // should be > 784
      })
      return () => cancelAnimationFrame(rafId)
    }

    const selectedAnnotationEl = (scrollContainer.current as HTMLElement).querySelector(`div[data-annotation="${selectedAnnotation.annotation.id}"]`) as HTMLElement
    if (!selectedAnnotationEl) return
    scrollIntoViewIfNeeded(selectedAnnotationEl, scrollContainer.current)
  }, [selectedAnnotation])


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
