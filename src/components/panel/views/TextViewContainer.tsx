import { ErrorBoundary } from 'react-error-boundary'
import TextViewError from '@/components/panel/views/TextViewError.tsx'
import TextView from '@/components/panel/views/TextView.tsx'
import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useText } from '@/contexts/TextContext.tsx'

interface Props {
  showText: boolean
  showSidebarBorders: boolean
}
const TextViewContainer: FC<Props> = ({ showText, showSidebarBorders }) => {
  const { panelState, annotationsMode, showTextOptions } = usePanel()
  const { loadingText } = useText()

  return <div
    data-text-container
    className={`bg-background p-3 pr-5 relative flex border-r overflow-x-auto
      ${showSidebarBorders ? 'border-border' : 'border-transparent'} ${showTextOptions ? 'pt-16' : ''}
      ${annotationsMode === 'list' ? 'overflow-y-auto' : ''}
      ${loadingText ? 'overflow-hidden min-h-full h-full' : 'min-h-[calc(100%+1px)]'} `}
  >
    {showText &&
      <ErrorBoundary FallbackComponent={TextViewError} resetKeys={[panelState.item?.id]}><TextView /></ErrorBoundary>}
  </div>
}

export default TextViewContainer
