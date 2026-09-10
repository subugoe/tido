import FilterTree from '@/components/panel/annotations/filters/FilterTree.tsx'
import { updateNodesSelection } from '@/utils/filter-tree.ts'
import { getSelectedTypesFromNode } from '@/utils/annotations.ts'
import { getVisibleAnnotationTypes } from '@/utils/text.ts'
import { FC, useEffect, useState } from 'react'
import { FilterNodeWithSelection } from '@/types'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'


const MultipleRootFilter: FC = () => {
  const { setSelectedAnnotationTypes, dynamicAnnotationTypes, setDynamicAnnotationTypes, witnesses, panelState, annotationTypesBySource, annotationFilters: contextFilters, setAnnotationFilters: setContextFilters } = usePanel()
  const { annotations: annotationsConfig } = useConfig()

  const [localFilters, setLocalFilters] = useState<FilterNodeWithSelection[]>([])

  const annotationFilters = annotationsConfig.filters ? contextFilters : localFilters
  const setAnnotationFilters = annotationsConfig.filters ? setContextFilters : setLocalFilters

  // Recompute the local list whenever the visible views change (or a text contributes new types).
  // Only relevant when no annotation filters were configured; with a config, annotationFilters is fixed.
  useEffect(() => {
    if (annotationsConfig.filters) return

    const types = getVisibleAnnotationTypes(annotationTypesBySource, panelState.panelViews, panelState?.item?.contents ?? [])

    // The visible types come from the texts on screen, their selection state from the aggregated
    // dynamicAnnotationTypes, so a type keeps the state the user gave it across item navigation.
    setLocalFilters(types.map(type => ({
      types: [type],
      selected: dynamicAnnotationTypes.find(entry => entry.type === type)?.selected ?? true
    })))
  }, [panelState.panelViews, annotationTypesBySource, dynamicAnnotationTypes])

  const handleToggle = (path: number[]) => {
    let newFilters: FilterNodeWithSelection[] = [...annotationFilters]
    newFilters = updateNodesSelection(path, newFilters)
    setAnnotationFilters(newFilters)

    if (!annotationsConfig.filters) {
      // Without configured filters the selection state lives in dynamicAnnotationTypes. Only the types on
      // screen are touched; the ones contributed by other items keep their state.
      const toggledTypes = new Map<string, boolean>()
      newFilters.forEach(node => (node.types ?? []).forEach(type => toggledTypes.set(type as string, !!node.selected)))

      setDynamicAnnotationTypes(previous => previous.map(entry => (
        toggledTypes.has(entry.type) ? { ...entry, selected: toggledTypes.get(entry.type) } : entry
      )))
      return
    }

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
