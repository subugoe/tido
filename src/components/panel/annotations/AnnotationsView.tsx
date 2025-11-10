import { FC, useEffect, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import AlignAnnotationsList from '@/components/panel/annotations/AlignAnnotationsList.tsx'
import AnnotationsList from '@/components/panel/annotations/AnnotationsList.tsx'


const AnnotationsView: FC = () => {
  const { annotationsMode, getSidebarScroller } = usePanel()
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

  return <div ref={scrollContainer} className="relative flex-1 overflow-y-auto px-3">
    { annotationsMode === 'align' && <AlignAnnotationsList /> }
    { annotationsMode === 'list' && <AnnotationsList /> }
  </div>
}

export default AnnotationsView
