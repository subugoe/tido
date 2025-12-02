import { FC } from 'react'
import ImageRenderer from '@/components/panel/ImageRenderer.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import ImageRendererError from '@/components/panel/ImageRendererError.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'


const ImageView: FC = () => {
  const { panelState } = usePanel()

  return (
    <div className="flex w-full h-full" data-image-container>
      <ErrorBoundary FallbackComponent={ImageRendererError} resetKeys={[panelState.item?.id]}><ImageRenderer /></ErrorBoundary>
    </div>
  )
}

export default ImageView
