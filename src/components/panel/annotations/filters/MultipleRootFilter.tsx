import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { updateNodesSelection } from '@/utils/filter-tree.ts'
import { getSelectedTypesFromNode } from '@/utils/annotations.ts'
import { getVisibleAnnotationTypes } from '@/utils/text.ts'
import { FC, useEffect, useState } from 'react'
import { FilterNodeWithSelection } from '@/types'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'


const MultipleRootFilter: FC = () => {
  const { setSelectedAnnotationTypes, witnesses, panelState, annotationTypesBySource } = usePanel()
  const { annotations: annotationsConfig } = useConfig()

  const [annotationFilters, setAnnotationFilters] = useState<FilterNodeWithSelection[]>([])

  // Recompute the local list whenever the visible views change (or a text contributes new types).
  // Only relevant when no annotation filters were configured; with a config, annotationFilters is fixed.
  useEffect(() => {
    if (annotationsConfig.filters) return

    setAnnotationFilters(previous => {
      const types = getVisibleAnnotationTypes(annotationTypesBySource, panelState.panelViews, panelState?.item?.contents ?? [])

      return types.map(type => {
        const existing = previous.find(node => node.types?.length === 1 && node.types[0] === type)
        return { types: [type], selected: existing?.selected ?? true }
      })
    })
  }, [panelState.panelViews, annotationTypesBySource])

  const handleToggle = (path: number[]) => {
    let newFilters: FilterNodeWithSelection[] = [...annotationFilters]
    newFilters = updateNodesSelection(path, newFilters)
    setAnnotationFilters(newFilters)

    let types: AnnotationTypesDict = {}
    newFilters.forEach(node => {
      const nodeTypes = getSelectedTypesFromNode(node)
      if (Object.hasOwn(nodeTypes, 'Variant')) nodeTypes['Variant'] = witnesses.map(w => w.idno)
      types = { ...types, ...nodeTypes }
    })
    setTimeout(() => setSelectedAnnotationTypes(types), 100)
  }

  return <FilterTree nodes={annotationFilters} onToggle={handleToggle} />
}

export default MultipleRootFilter
