import { FC } from 'react'
import ContentTypesToggle from '@/components/panel/views/text/ContentTypesToggle.tsx'
import ViewHeader from '@/components/panel/views/ViewHeader.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'

// The toolbar of a text view, like the one of the annotations view. It stands above the text, which scrolls
// below it - in the aligned mode the annotations scroll in lockstep with the texts (same scrollTop), so the
// scroll containers of the views start at the same height below their headers of the same height.
// The label of the view on the left, like in the annotations view, the content type it shows on the right.
// Always shown, also without the content type toggle - else the text would start higher than the annotations.
const TextViewHeader: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { label } = useTextView()
  // the global switch for the content type toggles of all text views - each view can leave its own out
  // with showContentTypesToggle, see ContentTypesToggle
  const { showContentTypeToggle: showContentTypeToggles } = useConfig()

  return <ViewHeader data-cy="text-view-header">
    <span className="text-xs font-medium truncate mr-auto" data-cy="text-view-label">{ t(label ?? 'text') }</span>
    { showContentTypeToggles && <ContentTypesToggle /> }
  </ViewHeader>
}

export default TextViewHeader
