import { FC, useEffect } from 'react'
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
    matchedAnnotationsMap
  } = usePanel()

  useEffect(() => {
    if (annotationFilters) return

    const uniqueAnnotationTypes: string[] = [
      ...new Set(Object.keys(matchedAnnotationsMap).map((id) => matchedAnnotationsMap[id].annotation.body['x-content-type']))
    ]

    setAnnotationFilters({
      rootSelectionRule: 'multiple',
      items: uniqueAnnotationTypes.map(type => ({ types: [type], selected: true }))
    })

  }, [])


  function onChange(updatedTree: FilterNode[]) {
    annotationFilters.items = updatedTree
    setAnnotationFilters(annotationFilters)
    setSelectedAnnotationTypes(getSelectedTypes(updatedTree))
  }

  if (!annotationFilters) return null

  if (annotationFilters.rootSelectionRule === 'single') {
    return <SingleRootFilter config={annotationFilters} onChange={onChange} />
  }

  return <MultipleRootFilter config={annotationFilters} onChange={onChange} />
}

export default AnnotationFiltersContent
