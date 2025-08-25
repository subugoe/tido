import { FC } from 'react'
import ImageRenderer from '@/components/panel/ImageRenderer.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import ImageRendererError from '@/components/panel/ImageRendererError.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'


const ImageView: FC = () => {
  const { panelState } = usePanel()

  return (
    <ErrorBoundary FallbackComponent={ImageRendererError} resetKeys={[panelState.item?.id]}><ImageRenderer /></ErrorBoundary>
  )
}

export default ImageView
