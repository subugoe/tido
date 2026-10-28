import { FC } from 'react'
import ImageRenderer from '@/components/panel/renderers/image/ImageRenderer.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import ImageRendererError from '@/components/panel/renderers/image/ImageRendererError.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import EmptyImage from '@/components/panel/views/image/EmptyImage.tsx'
import { hasImage } from '@/utils/panel.ts'


const ImageView: FC = () => {
  const { panelState } = usePanel()

  // The image view only exists without images when it is configured explicitly in panelViews.
  // Then an item without an image (no images key, an empty array or an image without url) shows an empty state instead of an error.
  const hasNoImages = !!panelState.item && !hasImage(panelState.item)

  return (
    <div className="flex w-full h-full relative" data-image-container>
      {hasNoImages
        ? <EmptyImage />
        : <ErrorBoundary FallbackComponent={ImageRendererError} resetKeys={[panelState.item?.id]}><ImageRenderer /></ErrorBoundary>}
    </div>
  )
}

export default ImageView
