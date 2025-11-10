import { ErrorBoundary } from 'react-error-boundary'
import TextViewError from '@/components/panel/views/TextViewError.tsx'
import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import TextViewContent from '@/components/panel/views/TextViewContent.tsx'


const TextView: FC = () => {
  const { panelState } = usePanel()

  return <div className={`bg-background relative flex h-full overflow-hidden`}>
    <ErrorBoundary FallbackComponent={TextViewError} resetKeys={[panelState.item?.id]}>
      <TextViewContent />
    </ErrorBoundary>
  </div>
}

export default TextView
