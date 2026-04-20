import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/annotations/filters/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/annotations/AnnotationsModeToggle.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/constants'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const AnnotationsHeader: FC = () => {
  const { annotations } = useConfig()

  return <div
    data-cy="annotations-header"
    className="flex flex-col p-3 border-b border-border"
    style={{ height: `${PANEL_HEADER_HEIGHT}px` }}
  >
    <div className="flex">
      <AnnotationFilters  />
      { annotations.defaultMode && <AnnotationsModeToggle className="ml-auto" /> }
    </div>
  </div>
}

export default AnnotationsHeader
