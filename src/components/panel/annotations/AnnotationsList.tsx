import { FC, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import Annotation from '@/components/panel/annotations/Annotation.tsx'

import { getFilteredAnnotations } from '@/utils/annotations.ts'


const AnnotationsList: FC = () => {

  const { matchedAnnotationsMap, getSidebarScroller } = usePanel()
  const filteredAnnotations = getFilteredAnnotations(matchedAnnotationsMap)

  useEffect(() => {
    const scroller = getSidebarScroller()
    scroller.stop()
  }, [])

  if (filteredAnnotations.length > 0) return <div className={`transition-opacity pt-4`}>
    {filteredAnnotations.map(a => <Annotation
      data={a}
      key={a.id}
    />)}
  </div>
}

export default AnnotationsList
