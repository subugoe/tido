import  { FC } from 'react'
import { X } from 'lucide-react'
import AnnotationFilters from '@/components/panel/annotations/filters/AnnotationFilters.tsx'
import AnnotationsModeToggle from '@/components/panel/annotations/sidebar/AnnotationsModeToggle.tsx'
import { PANEL_HEADER_HEIGHT } from '@/utils/constants.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'

const AnnotationsHeader: FC = () => {
  const { annotations } = useConfig()
  const { usePanelTranslation, updatePanel } = usePanel()
  const { t } = usePanelTranslation()

  return <div
    data-cy="annotations-header"
    className="bg-background flex flex-col px-3 justify-center border-b border-border"
    style={{ height: `${PANEL_HEADER_HEIGHT}px` }}
  >
    <div className="flex items-center">
      <AnnotationFilters  />
      { annotations.defaultMode && <AnnotationsModeToggle className="ml-auto" /> }
      <BaseTooltip message={t('hide_annotations')}>
        <Button size="iconSm" variant="ghost" onClick={() => updatePanel({ showSidebar: false })} data-cy="close-sidebar">
          <X />
        </Button>
      </BaseTooltip>
    </div>
  </div>
}

export default AnnotationsHeader
