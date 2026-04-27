import { updateNodesSelection } from '@/utils/filter-tree.ts'
import { FC, useCallback, useState } from 'react'
import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { getSelectedTypesFromNode } from '@/utils/annotations.ts'
import { FilterNodeWithSelection } from '@/types'

const SingleRootFilter: FC = () => {
  const { setSelectedAnnotationTypes, annotationFilters, setAnnotationFilters } = usePanel()
  const [activeRootIndex, setActiveRootIndex] = useState(annotationFilters.findIndex(node => node.selected))

  const handleToggle = (path: number[]) => {
    const newFilters: FilterNodeWithSelection[] = [...annotationFilters]
    newFilters[activeRootIndex].items = updateNodesSelection(path, newFilters[activeRootIndex].items)
    setAnnotationFilters(newFilters)
    setTimeout(() => setSelectedAnnotationTypes(getSelectedTypesFromNode(newFilters[activeRootIndex])), 100)
  }

  const handleTabChange = useCallback((value: string) => {
    const index = parseInt(value)
    setActiveRootIndex(index)
    annotationFilters.forEach((node, i) => node.selected = i === index)
    setAnnotationFilters(annotationFilters)
    setTimeout(() => setSelectedAnnotationTypes(getSelectedTypesFromNode(annotationFilters[index])), 100)
  }, [setAnnotationFilters])

  return (
    <Tabs value={String(activeRootIndex)} onValueChange={handleTabChange}>
      <div className="overflow-x-auto">
        <TabsList>
          {annotationFilters.map((node, index) => (
            <TabsTrigger key={index} value={String(index)}>
              {node.label || `Filter ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {annotationFilters.map((node, index) => (
        <TabsContent key={index} value={String(index)}>
          <div className="border border-border rounded-xl p-2">
            <FilterTree nodes={node.items} onToggle={handleToggle} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default SingleRootFilter
