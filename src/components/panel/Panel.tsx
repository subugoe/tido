import { FC, memo } from 'react'
import PanelContent from '@/components/panel/PanelContent.tsx'
import { PanelProvider } from '@/contexts/PanelContext.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import PanelError from '@/components/panel/PanelError.tsx'
import PanelShell from '@/components/panel/PanelShell.tsx'

interface Props {
  state: PanelState
}
const Panel: FC<Props> = memo(({ state }) => {
  return <PanelProvider panelId={state.id}>
    <PanelShell>
      <ErrorBoundary FallbackComponent={PanelError} resetKeys={[JSON.stringify(state.config)]}>
        <PanelContent />
      </ErrorBoundary>
    </PanelShell>
  </PanelProvider>
})

export default Panel
