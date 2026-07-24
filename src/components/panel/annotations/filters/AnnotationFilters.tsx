import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListFilter } from 'lucide-react'
import AnnotationFiltersContent from '@/components/panel/annotations/filters/AnnotationFiltersContent.tsx'
import { getVisibleAnnotationTypes } from '@/utils/text.ts'
import { cn } from '@/lib/utils.ts'
import { SIDEBAR_DEFAULT_WIDTH } from '@/utils/constants'

interface Props {
  className?: string
}
const AnnotationFilters: FC<Props> = ({ className }) => {
  const { usePanelTranslation, annotationFilters, annotationTypesBySource, panelState } = usePanel()
  const { annotations: annotationsConfig } = useConfig()
  const { t } = usePanelTranslation()
  const [open, setOpen] = useState(false)

  // With configured filters the button reflects that fixed list; otherwise it reflects whether any of
  // the currently visible texts discovered types (the same visibility rule the filter list uses).
  const hasFilters = annotationsConfig.filters
    ? (annotationFilters && annotationFilters.length > 0)
    : getVisibleAnnotationTypes(annotationTypesBySource, panelState?.panelViews ?? [], panelState?.item?.contents ?? []).length > 0

  return <div className={cn('flex flex-col items-center', className)}>
    <Popover onOpenChange={(value) => setOpen(value)}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={open ? 'bg-muted' : ''} disabled={!hasFilters}><ListFilter />{ t('filters') }</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-fit overflow-y-auto flex flex-col overflow-hidden"
        style={{ 'width': `calc(${SIDEBAR_DEFAULT_WIDTH}px - 2 * 0.75rem)` }}
      >
        <AnnotationFiltersContent />
      </PopoverContent>
    </Popover>
  </div>
}

export default AnnotationFilters
