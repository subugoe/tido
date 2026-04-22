import { ErrorBoundary } from 'react-error-boundary'
import TextViewError from '@/components/panel/views/text/TextViewError.tsx'
import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import TextViewContent from '@/components/panel/views/text/TextViewContent.tsx'
import { TextViewProvider } from '@/contexts/TextViewContext.tsx'

interface Props {
  viewIndex: number
  visible: boolean
}
const TextView: FC<Props> = ({ viewIndex, visible }) => {
  const { panelState } = usePanel()

  return <div className={`bg-background relative z-1 flex h-full w-full overflow-hidden`}>
    <ErrorBoundary FallbackComponent={TextViewError} resetKeys={[panelState.item?.id]}>
      <TextViewProvider viewIndex={viewIndex} visible={visible}>
        <TextViewContent />
      </TextViewProvider>
    </ErrorBoundary>
  </div>
}

export default TextView
