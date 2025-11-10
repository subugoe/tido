import { ErrorBoundary } from 'react-error-boundary'
import TextViewError from '@/components/panel/views/TextViewError.tsx'
import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Swapper from '@/components/panel/Swapper.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import ImageView from '@/components/panel/views/ImageView.tsx'


const swapOptions = {
  A: <TextView />,
  B: <ImageView />
}

const SwapView: FC = () => {
  const { panelState } = usePanel()
  const [view, setView] = useState(swapOptions.A)
  const [activeMode, setActiveMode] = useState('A')

  function swap(mode: string) {
    setActiveMode(mode)
    setView(swapOptions[mode])
  }

  return <div className={`bg-background relative flex h-full overflow-hidden`}>
    <ErrorBoundary FallbackComponent={TextViewError} resetKeys={[panelState.item?.id]}>
      { view }
      <Swapper activeMode={activeMode} onChange={swap} />
    </ErrorBoundary>
  </div>
}

export default SwapView
