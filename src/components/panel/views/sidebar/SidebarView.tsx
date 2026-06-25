import { FC } from 'react'
import AnnotationsHeader from '@/components/panel/annotations/sidebar/AnnotationsHeader.tsx'
import AnnotationsView from '@/components/panel/annotations/sidebar/AnnotationsView.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import AnnotationsError from '@/components/panel/annotations/sidebar/AnnotationsError.tsx'
import Loading from '@/components/ui/loading.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { AnnotationsProvider, useAnnotations } from '@/contexts/AnnotationsContext.tsx'

const SidebarOverlay: FC = () => {
  const { alignmentLoading } = useAnnotations()
  const { annotationsLoading } = usePanel()

  if (!annotationsLoading && !alignmentLoading) return null

  return (
    <div className="absolute z-10 bg-background left-0 top-0 w-full h-full">
      <Loading />
    </div>
  )
}

const SidebarView: FC = () => {
  const { panelState } = usePanel()
  const itemId = panelState.item?.id

  return (
    <div className="flex flex-col h-full" data-sidebar-container>
      <ErrorBoundary FallbackComponent={AnnotationsError} resetKeys={[itemId]}>
        <AnnotationsProvider>
          <AnnotationsHeader />
          <AnnotationsView />
          <SidebarOverlay />
        </AnnotationsProvider>
      </ErrorBoundary>
    </div>
  )
}

export default SidebarView
