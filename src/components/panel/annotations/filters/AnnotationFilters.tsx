import { FC, useEffect } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListFilter } from 'lucide-react'
import AnnotationFiltersContent from '@/components/panel/annotations/filters/AnnotationFiltersContent.tsx'
import { cn } from '@/lib/utils.ts'
import { SIDEBAR_DEFAULT_WIDTH } from '@/utils/panel.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'


interface Props {
  className?: string
}
const AnnotationFilters: FC<Props> = ({ className }) => {
  const { annotations: annotationsConfig } = useConfig()
  const {
    annotationFilters,
    usePanelTranslation,
    setAnnotationFilters,
    matchedAnnotationsMap
  } = usePanel()

  const { t } = usePanelTranslation()

  useEffect(() => {
    // This is for the case where no specific annotation filters were configured.
    // We extract all occurring types from the annotations that match the text.

    if (annotationsConfig.filters || annotationFilters !== null) return

    const uniqueAnnotationTypes: string[] = [
      ...new Set(Object.keys(matchedAnnotationsMap).map((id) => matchedAnnotationsMap[id].annotation.body['x-content-type']))
    ]

    setAnnotationFilters({
      rootSelectionRule: 'multiple',
      items: uniqueAnnotationTypes.map(type => ({ types: [type], selected: true }))
    })

  }, [matchedAnnotationsMap])

  return <div className={cn('flex flex-col items-center', className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><ListFilter /> { t('filters')}</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="h-fit overflow-y-auto flex flex-col overflow-hidden"
        style={{ 'width': `calc(${SIDEBAR_DEFAULT_WIDTH}px - 2 * 0.75rem)` }}
      >
        <h3 className="font-bold mb-4">Filters</h3>
        <AnnotationFiltersContent />
      </PopoverContent>
    </Popover>
  </div>
}

export default AnnotationFilters
