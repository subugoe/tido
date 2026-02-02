import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ListFilter } from 'lucide-react'
import AnnotationFiltersContent from '@/components/panel/annotations/filters/AnnotationFiltersContent.tsx'
import { cn } from '@/lib/utils.ts'
import { SIDEBAR_DEFAULT_WIDTH } from '@/utils/panel.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { AnnotationFiltersConfig } from '@/types'


interface Props {
  className?: string
}
const AnnotationFilters: FC<Props> = ({ className }) => {
  const { annotations: annotationsConfig } = useConfig()
  const {
    usePanelTranslation,
    annotationFilters,
    setAnnotationFilters,
    matchedAnnotationsMap
  } = usePanel()

  const { t } = usePanelTranslation()

  const [visibleAnnotFilters, setVisibleAnnotFilters] = useState<AnnotationFiltersConfig>()


  useEffect(() => {
    // This is for the case where no specific annotation filters were configured.
    // We extract all occurring types from the annotations that match the text.

    if (annotationsConfig.filters) return

    const uniqueAnnotationTypes: string[] = [
      ...new Set(Object.keys(matchedAnnotationsMap).map((id) => matchedAnnotationsMap[id].annotation.body['x-content-type']))
    ]
    const newAnnotationFilters = { ...annotationFilters }
    if (!newAnnotationFilters.hasOwnProperty('items')) newAnnotationFilters['items'] = []
    const newVisibleAnnotFilters: AnnotationFiltersConfig = {
      rootSelectionRule: 'multiple',
      items: []
    }

    const typesInGlobalFilter = annotationFilters?.items ? new Set(annotationFilters.items?.flatMap(item => item.types)) : new Set([])


    // TODO: use only one loop for updating annotationsFilter based on new item

    // iterate through types in filter.
    //    If a new type coming from matchedAnnotationsMap -> add it in filter

    for (const type of uniqueAnnotationTypes) {
      if (!typesInGlobalFilter.has(type)) {
        newAnnotationFilters.items.push({
          types: [type],
          selected: true
        })
      }
    }

    // update visibleAnnotFilter containing items which are included in uniqueAnnotationTypes

    if (annotationFilters) {
      newVisibleAnnotFilters.items = annotationFilters?.items.filter(item =>
        item.types.some(type => uniqueAnnotationTypes.includes(type))
      )
    }
    else {
      newVisibleAnnotFilters.items = newAnnotationFilters?.items.filter(item =>
        item.types.some(type => uniqueAnnotationTypes.includes(type))
      )
    }

    setVisibleAnnotFilters(newVisibleAnnotFilters)

    setAnnotationFilters({
      rootSelectionRule: 'multiple',
      items: newAnnotationFilters.items
    })

    //setSelectedAnnotationTypes(newSelectedTypes)
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
        <AnnotationFiltersContent visibleAnnotFilters={visibleAnnotFilters} />
      </PopoverContent>
    </Popover>
  </div>
}

export default AnnotationFilters
