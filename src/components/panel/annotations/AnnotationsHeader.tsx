import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/annotations/filters/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/annotations/AnnotationsModeToggle.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/panel.ts'

const AnnotationsHeader: FC = () => {
  return <div
    data-cy="annotations-header"
    className="flex flex-col p-3 border-b border-border"
    style={{ height: `${PANEL_HEADER_HEIGHT}px` }}
  >
    <div className="flex">
      <AnnotationFilters  />
      <AnnotationsModeToggle className="ml-auto" />
    </div>
  </div>
}

export default AnnotationsHeader
