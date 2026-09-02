import { FC, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'

interface Props {
  className?: string
}

const AnnotationsModeToggle: FC<Props> = ({ className }) => {
  const { annotationsMode, setAnnotationsMode, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const [_mode, _setMode] = useState<AnnotationsMode>(annotationsMode)

  function updateMode(value: AnnotationsMode) {
    _setMode(value)
    setTimeout(() => {
      setAnnotationsMode(value)
    }, 200)
  }

  return (
    <div
      className={cn('flex items-center text-muted-foreground', className)}
      data-cy="annotations-mode-toggle"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconSm" variant="ghost" data-cy="annotations-menu">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className={_mode === 'list' ? 'text-primary font-medium' : ''}
            onClick={() => updateMode('list')}
            data-cy="list"
            data-state={_mode === 'list' ? 'on' : 'off'}
          >
            {t('list')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={_mode === 'aligned' ? 'text-primary font-medium' : ''}
            onClick={() => updateMode('aligned')}
            data-cy="aligned"
            data-state={_mode === 'aligned' ? 'on' : 'off'}
          >
            {t('aligned')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default AnnotationsModeToggle
