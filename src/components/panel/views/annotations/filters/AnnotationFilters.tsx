import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListFilter } from 'lucide-react'
import AnnotationFiltersContent from '@/components/panel/views/annotations/filters/AnnotationFiltersContent.tsx'
import { getVisibleAnnotationTypes } from '@/utils/text.ts'
import { cn } from '@/lib/utils.ts'
import { ANNOTATIONS_PANE_DEFAULT_WIDTH } from '@/utils/constants'

interface Props {
  className?: string
}
const AnnotationFilters: FC<Props> = ({ className }) => {
  const { usePanelTranslation, annotationFilters, annotationTypesBySource, panelState, panelRootRef } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { t } = usePanelTranslation()
  const [open, setOpen] = useState(false)

  // With configured filters the button reflects that fixed list; otherwise it reflects whether any of
  // the currently visible texts discovered types (the same visibility rule the filter list uses).
  const hasFilters = annotationsConfig.filters
    ? (annotationFilters && annotationFilters.length > 0)
    : getVisibleAnnotationTypes(annotationTypesBySource, panelState?.panelViews ?? [], panelState?.item ?? null).length > 0

  return <div className={cn('flex flex-col items-center', className)}>
    <Popover onOpenChange={(value) => setOpen(value)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={`h-7 text-xs [&_svg]:size-3.5 text-muted-foreground hover:text-foreground ${open ? 'bg-muted text-foreground' : ''}`} disabled={!hasFilters}><ListFilter />{ t('filters') }</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-fit overflow-y-auto flex flex-col overflow-hidden"
        style={{ 'width': `calc(${ANNOTATIONS_PANE_DEFAULT_WIDTH}px - 2 * 0.75rem)` }}
        container={panelRootRef.current}
      >
        <AnnotationFiltersContent />
      </PopoverContent>
    </Popover>
  </div>
}

export default AnnotationFilters
