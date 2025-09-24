import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const AnnotationsModeToggle: FC = () => {
  const { annotationsMode, setAnnotationsMode } = usePanel()

  function updateMode() {
    if (annotationsMode === 'align') {
      setAnnotationsMode('list')
      return
    }
    setAnnotationsMode('align')
  }

  return <div className="flex items-center space-x-2 text-muted-foreground">
    <Label htmlFor="annotations-mode">List View</Label>
    <Switch id="annotations-mode" onCheckedChange={updateMode} checked={annotationsMode === 'list'} />
  </div>
}

export default AnnotationsModeToggle
