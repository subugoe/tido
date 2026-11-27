import { FC } from 'react'
import { AlignVerticalJustifyStart, List } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'

// Switches the annotations between the plain list and the aligned mode, where every card sits next to
// its target in the text. One of the two is always on. A segmented control like the view toggles in the
// panel header.

// in a narrow pane only the icons - the names are in the tooltips then
const labelClasses = 'hidden @min-[320px]/annotations-header:inline'

const AnnotationsModeToggle: FC = () => {
  const { annotationsMode, setAnnotationsMode, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <ToggleGroup
    type="single"
    variant="segmented"
    spacing={0.5}
    size="xs"
    value={annotationsMode}
    // clicking the mode that is on would switch both off - it is ignored
    onValueChange={(mode: 'list' | 'aligned') => mode && setAnnotationsMode(mode)}
    data-cy="annotations-mode-toggle"
  >
    <ToggleGroupItem value="list" aria-label={t('list')} title={t('list')} data-cy="list">
      <List />
      <span className={labelClasses}>{ t('list') }</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="aligned" aria-label={t('aligned')} title={t('aligned')} data-cy="aligned">
      <AlignVerticalJustifyStart />
      <span className={labelClasses}>{ t('aligned') }</span>
    </ToggleGroupItem>
  </ToggleGroup>
}

export default AnnotationsModeToggle
