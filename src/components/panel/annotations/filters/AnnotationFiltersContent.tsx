import { FC } from 'react'
import { FilterNode } from '@/types'
import { getSelectedTypes } from '@/utils/annotations.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import SingleRootFilter from '@/components/panel/annotations/filters/SingleRootFilter.tsx'
import MultipleRootFilter from '@/components/panel/annotations/filters/MultipleRootFilter.tsx'

const AnnotationFiltersContent: FC = () => {
  const {
    annotationFilters,
    setAnnotationFilters,
    setSelectedAnnotationTypes,
  } = usePanel()

  function onChange(updatedTree: FilterNode[]) {
    setTimeout(() => {
      setAnnotationFilters(prev => ({
        ...prev,
        items: updatedTree
      }))
      setSelectedAnnotationTypes(getSelectedTypes(updatedTree))
    }, 100)
  }

  if (!annotationFilters) return null

  if (annotationFilters.rootSelectionRule === 'single') {
    return <SingleRootFilter config={annotationFilters} onChange={onChange} />
  }

  return <MultipleRootFilter config={annotationFilters} onChange={onChange} />
}

export default AnnotationFiltersContent
