import { FC } from 'react'
import { AnnotationFiltersConfig, FilterNode } from '@/types'
import { getSelectedTypes } from '@/utils/annotations.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import SingleRootFilter from '@/components/panel/annotations/filters/SingleRootFilter.tsx'
import MultipleRootFilter from '@/components/panel/annotations/filters/MultipleRootFilter.tsx'

interface Props {
  visibleAnnotFilters: AnnotationFiltersConfig
}

const AnnotationFiltersContent: FC<Props> = ({ visibleAnnotFilters }) => {
  const {
    annotationFilters,
    setAnnotationFilters,
    setSelectedAnnotationTypes,
  } = usePanel()

  function onChange(updatedTree: FilterNode[]) {
    annotationFilters.items = updatedTree
    setAnnotationFilters(annotationFilters)
    setSelectedAnnotationTypes(getSelectedTypes(updatedTree))
  }

  if (!annotationFilters) return null

  if (annotationFilters.rootSelectionRule === 'single') {
    return <SingleRootFilter config={annotationFilters} onChange={onChange} />
  }

  return <MultipleRootFilter config={visibleAnnotFilters} onChange={onChange} />
}

export default AnnotationFiltersContent
