import { FC, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'

const AnnotationsModeToggle: FC = () => {
  const { annotationsMode, setAnnotationsMode, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const [_mode, _setMode] = useState(annotationsMode)
  function updateMode(value: AnnotationsMode) {
    // Debounce Switch animation from update of annotationsMode
    _setMode(value)

    setTimeout(() => {
      setAnnotationsMode(value)
    }, 200)
  }

  return <div className="flex items-center space-x-2 text-muted-foreground" aria-label="annotations-mode-toggle">
    <ToggleGroup type="single" variant="outline" spacing={0} value={_mode} onValueChange={updateMode}>
      <ToggleGroupItem value="list">{ t('list') }</ToggleGroupItem>
      <ToggleGroupItem value="aligned">{ t('aligned') }</ToggleGroupItem>
    </ToggleGroup>
  </div>
}

export default AnnotationsModeToggle
