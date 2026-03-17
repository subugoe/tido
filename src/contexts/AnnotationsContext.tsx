import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { findTargets, getFilteredAnnotations, getNestedAnnotations } from '@/utils/annotations.ts'

type State = {
  filteredAnnotations: Annotation[],
  nestedMatchedAnnotationsMap: NestedMatchedAnnotationsMap,
  setNestedMatchedAnnotationsMap: (newNestedMatchedAnnotationsMap: NestedMatchedAnnotationsMap) => void,
  hoveredNestedAnnotationIds: string[],
  setHoveredNestedAnnotationIds: (newHoveredAnnotationIds: string[]) => void,
}

const AnnotationsContext = createContext<State>(null)

export const AnnotationsProvider = ({ children }: { children: ReactNode }) => {
  const { matchedAnnotationsMaps, panelState, annotationsMode } = usePanel()
  const [filteredAnnotations, setFilteredAnnotations] = useState<Annotation[]>([])
  const [nestedMatchedAnnotationsMap, setNestedMatchedAnnotationsMap ] = useState<NestedMatchedAnnotationsMap>({})
  const [hoveredNestedAnnotationIds, setHoveredNestedAnnotationIds ] = useState<string[]>([])


  useEffect(() => {
    const newFiltered: Annotation[] = []
    Object
      .keys(matchedAnnotationsMaps)
      .forEach(contentUrl => {
        newFiltered.push(...getFilteredAnnotations(matchedAnnotationsMaps[contentUrl]))
      })
    setFilteredAnnotations(newFiltered)
  }, [matchedAnnotationsMaps])

  useEffect(() => {
    const newNestedMatchedAnnotationsMap: NestedMatchedAnnotationsMap = {}
    panelState.annotations.forEach((annotation) => {
      const nestedAnnotations = getNestedAnnotations(annotation, panelState.annotations)
      const target = findTargets(annotation)
      newNestedMatchedAnnotationsMap[annotation.id] = {
        nestedAnnotations,
        target,
        annotation
      }
    })
    setNestedMatchedAnnotationsMap(newNestedMatchedAnnotationsMap)
  }, [panelState.annotations, annotationsMode])

  return (
    <AnnotationsContext.Provider value={{
      filteredAnnotations,
      nestedMatchedAnnotationsMap,
      setNestedMatchedAnnotationsMap,
      hoveredNestedAnnotationIds,
      setHoveredNestedAnnotationIds
    }}>
      {children}
    </AnnotationsContext.Provider>
  )
}

export const useAnnotations = () => {
  const context = useContext(AnnotationsContext)

  if (context === undefined)
    throw new Error('useAnnotations must be used within a AnnotationsProvider')

  return context
}
