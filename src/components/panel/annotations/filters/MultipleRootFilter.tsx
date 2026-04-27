import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { updateNodesSelection } from '@/utils/filter-tree.ts'
import { getSelectedTypesFromNode } from '@/utils/annotations.ts'
import { FC } from 'react'
import { FilterNodeWithSelection } from '@/types'
import { usePanel } from '@/contexts/PanelContext.tsx'


const MultipleRootFilter: FC = () => {
  const { setSelectedAnnotationTypes, annotationFilters, setAnnotationFilters } = usePanel()

  const handleToggle = (path: number[]) => {
    let newFilters: FilterNodeWithSelection[] = [...annotationFilters]
    newFilters = updateNodesSelection(path, newFilters)
    setAnnotationFilters(newFilters)

    let types: AnnotationTypesDict = {}
    newFilters.forEach(node => {
      const nodeTypes = getSelectedTypesFromNode(node)
      types = { ...types, ...nodeTypes }
    })
    setTimeout(() => setSelectedAnnotationTypes(types), 100)
  }

  return <FilterTree nodes={annotationFilters} onToggle={handleToggle} />
}

export default MultipleRootFilter
