import { FC, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const AnnotationsModeToggle: FC = () => {
  const { annotationsMode, setAnnotationsMode } = usePanel()
  const [_mode, _setMode] = useState(annotationsMode)
  function updateMode() {
    let newMode
    if (annotationsMode === 'align') newMode = 'list'
    if (annotationsMode === 'list')  newMode = 'align'

    // Debounce Switch animation from update of annotationsMode
    _setMode(newMode)

    setTimeout(() => {
      setAnnotationsMode(newMode)
    }, 200)
  }

  return <div className="flex items-center space-x-2 text-muted-foreground" aria-label="annotations-mode-toggle">
    <Label htmlFor="annotations-mode">List View</Label>
    <Switch id="annotations-mode" onCheckedChange={updateMode} checked={_mode === 'list'} />
  </div>
}

export default AnnotationsModeToggle
