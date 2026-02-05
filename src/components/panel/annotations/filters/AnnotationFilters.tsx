import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListFilter } from 'lucide-react'
import AnnotationFiltersContent from '@/components/panel/annotations/filters/AnnotationFiltersContent.tsx'
import { cn } from '@/lib/utils.ts'
import { SIDEBAR_DEFAULT_WIDTH } from '@/utils/panel.ts'


interface Props {
  className?: string
}
const AnnotationFilters: FC<Props> = ({ className }) => {
  const { usePanelTranslation } = usePanel()

  const { t } = usePanelTranslation()

  return <div className={cn('flex flex-col items-center', className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><ListFilter />{ t('filters') }</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-fit overflow-y-auto flex flex-col overflow-hidden"
        style={{ 'width': `calc(${SIDEBAR_DEFAULT_WIDTH}px - 2 * 0.75rem)` }}
      >
        <h3 className="font-bold mb-4">{ t('filters') }</h3>
        <AnnotationFiltersContent />
      </PopoverContent>
    </Popover>
  </div>
}

export default AnnotationFilters
