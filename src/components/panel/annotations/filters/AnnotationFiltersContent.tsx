import { FC } from 'react'
import SingleRootFilter from '@/components/panel/annotations/filters/SingleRootFilter.tsx'
import MultipleRootFilter from '@/components/panel/annotations/filters/MultipleRootFilter.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const AnnotationFiltersContent: FC = () => {
  const { annotations: config } = useConfig()

  if (!config) return null

  if (config.filters?.rootSelectionRule && config.filters.rootSelectionRule === 'single') {
    return <SingleRootFilter />
  }

  return <MultipleRootFilter />
}

export default AnnotationFiltersContent
