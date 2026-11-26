import { FC } from 'react'
import ViewHeader from '@/components/panel/views/ViewHeader.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import ImageActionButtons from '@/components/panel/views/image/ImageActionButtons.tsx'

interface Props {
  label?: string
  showActions: boolean
}

// The toolbar of an image view, like the ones of the text and annotations views: the label of the view
// on the left, the zoom buttons on the right. Unlike those it pushes the image down - images do not
// scroll in lockstep with the other views, so the viewer can start below it.
const ImageViewHeader: FC<Props> = ({ label, showActions }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <ViewHeader data-cy="image-view-header">
    <span className="text-xs font-medium truncate mr-auto" data-cy="image-view-label">{ t(label || 'image') }</span>
    { showActions && <ImageActionButtons /> }
  </ViewHeader>
}

export default ImageViewHeader
