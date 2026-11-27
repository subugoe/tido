import { FC } from 'react'
import ImageRenderer from '@/components/panel/renderers/image/ImageRenderer.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import ImageRendererError from '@/components/panel/renderers/image/ImageRendererError.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import EmptyImage from '@/components/panel/views/image/EmptyImage.tsx'
import ImageViewHeader from '@/components/panel/views/image/ImageViewHeader.tsx'
import { hasImage } from '@/utils/panel-views.ts'

interface Props {
  viewKey: number
}

const ImageView: FC<Props> = ({ viewKey }) => {
  const { panelState } = usePanel()
  const label = panelState.panelViews.find(v => v.key === viewKey)?.label

  // The image view is only shown without images when 'image' is not in hideEmptyViews.
  // Then an item without an image (no images key, an empty array or an image without url) shows an empty state instead of an error.
  const hasNoImages = !!panelState.item && !hasImage(panelState.item)

  return (
    <div className="flex flex-col w-full h-full">
      {/* the zoom buttons only with an image - OpenSeadragon binds them by id when the renderer mounts */}
      <ImageViewHeader label={label} showActions={!hasNoImages} />
      <div className="flex flex-1 min-h-0 w-full relative" data-image-container>
        {hasNoImages
          ? <EmptyImage />
          : <ErrorBoundary FallbackComponent={ImageRendererError} resetKeys={[panelState.item?.id]}><ImageRenderer /></ErrorBoundary>}
      </div>
    </div>
  )
}

export default ImageView
