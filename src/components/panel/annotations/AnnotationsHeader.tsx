import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/annotations/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/annotations/AnnotationsModeToggle.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/panel.ts'

const AnnotationsHeader: FC = () => {
  return <div
    data-cy="annotations-header"
    className="flex flex-col items-center p-3 pt-6 border-b border-border"
    style={{ height: `${PANEL_HEADER_HEIGHT}px` }}
  >
    <div className="absolute top-1 right-1">
      <AnnotationsModeToggle />
    </div>
    <AnnotationFilters />
  </div>
}

export default AnnotationsHeader
