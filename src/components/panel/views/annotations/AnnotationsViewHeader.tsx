import  { FC } from 'react'
import AnnotationFilters from '@/components/panel/views/annotations/filters/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/views/annotations/AnnotationsModeToggle.tsx'
import ViewHeader from '@/components/panel/views/ViewHeader.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { useAnnotationsCount } from '@/components/panel/views/annotations/useAnnotationsCount.ts'
import { annotationsView } from '@/utils/panel-views.ts'

// The toolbar of the annotations view. It stands above the list, which scrolls below it - in the aligned
// mode the list scrolls in lockstep with the texts (same scrollTop), so its scroll container starts at the
// same height as theirs, below a text header of the same height.
const AnnotationsViewHeader: FC = () => {
  const { annotations } = useConfig()
  const { usePanelTranslation, panelState } = usePanel()
  const { t } = usePanelTranslation()
  // the label of the annotations view when the panel views configure one
  const label = annotationsView(panelState.panelViews)?.label || t('annotations')
  const count = useAnnotationsCount()

  return <ViewHeader data-cy="annotations-header" className="@container/annotations-header">
    {/* the toggle in the panel header already names the view - in a narrow pane the label would only be cut
        to a few letters, so it gives its room to the tools there. The number of annotations listed stays. */}
    <div className="flex items-center gap-1.5 min-w-0 mr-auto">
      <span className="text-xs font-medium truncate hidden @min-[360px]/annotations-header:block">{ label }</span>
      <Badge variant="muted" className="rounded-full px-1.5 leading-none tabular-nums" data-cy="annotations-count">
        { count }
      </Badge>
    </div>
    <AnnotationFilters />
    { annotations.defaultMode && <AnnotationsModeToggle /> }
  </ViewHeader>
}

export default AnnotationsViewHeader
