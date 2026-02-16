import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/annotations/filters/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/annotations/AnnotationsModeToggle.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/panel.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const AnnotationsHeader: FC = () => {
  const { matchedAnnotationsMap } = usePanel()
  const { annotations } = useConfig()


  return <div
    data-cy="annotations-header"
    className="flex flex-col p-3 border-b border-border"
    style={{ height: `${PANEL_HEADER_HEIGHT}px` }}
  >
    { matchedAnnotationsMap && Object.keys(matchedAnnotationsMap).length > 0 &&
      <div className="flex">
        <AnnotationFilters  />
        { annotations.defaultMode && <AnnotationsModeToggle className="ml-auto" /> }
      </div>
    }
  </div>
}

export default AnnotationsHeader
