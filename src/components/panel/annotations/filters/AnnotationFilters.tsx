import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListFilter } from 'lucide-react'
import AnnotationFiltersContent from '@/components/panel/annotations/filters/AnnotationFiltersContent.tsx'
import { cn } from '@/lib/utils.ts'
import { SIDEBAR_DEFAULT_WIDTH } from '@/utils/constants'

interface Props {
  className?: string
}
const AnnotationFilters: FC<Props> = ({ className }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { annotationFilters } = usePanel()
  const [open, setOpen] = useState(false)

  const hasFilters = annotationFilters?.items && annotationFilters.items.length > 0

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
