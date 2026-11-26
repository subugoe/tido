import { FC } from 'react'
import AnnotationsViewHeader from '@/components/panel/views/annotations/AnnotationsViewHeader.tsx'
import AnnotationsViewContent from '@/components/panel/views/annotations/AnnotationsViewContent.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import AnnotationsViewError from '@/components/panel/views/annotations/AnnotationsViewError.tsx'
import Loading from '@/components/ui/loading.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { AnnotationsProvider, useAnnotations } from '@/contexts/AnnotationsContext.tsx'

const AnnotationsLoadingOverlay: FC = () => {
  const { alignmentLoading } = useAnnotations()
  const { annotationsLoading } = usePanel()

  if (!annotationsLoading && !alignmentLoading) return null

  return (
    <div data-cy="annotations-loading" className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading />
    </div>
  )
}

const AnnotationsView: FC = () => {
  const { panelState } = usePanel()
  const itemId = panelState.item?.id

  return (
    <div className="relative flex flex-col h-full border-l border-border" data-annotations-view>
      <ErrorBoundary FallbackComponent={AnnotationsViewError} resetKeys={[itemId]}>
        <AnnotationsProvider>
          <AnnotationsViewHeader />
          <AnnotationsViewContent />
          <AnnotationsLoadingOverlay />
        </AnnotationsProvider>
      </ErrorBoundary>
    </div>
  )
}

export default AnnotationsView
