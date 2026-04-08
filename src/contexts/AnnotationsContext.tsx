import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  createMatchedAnnotationsMap,
  getFilteredAnnotations,
} from '@/utils/annotations.ts'

type State = {
  filteredAnnotations: Annotation[],
  nestedMatchedAnnotationsMap: MatchedAnnotationsMap,
  setNestedMatchedAnnotationsMap: (newNestedMatchedAnnotationsMap: MatchedAnnotationsMap) => void,
  hoveredNestedAnnotationIds: string[],
  setHoveredNestedAnnotationIds: (newHoveredAnnotationIds: string[]) => void,
}

const AnnotationsContext = createContext<State>(null)

export const AnnotationsProvider = ({ children }: { children: ReactNode }) => {
  const { matchedAnnotationsMaps, annotations } = usePanel()
  const [filteredAnnotations, setFilteredAnnotations] = useState<Annotation[]>([])
  const [nestedMatchedAnnotationsMap, setNestedMatchedAnnotationsMap ] = useState<MatchedAnnotationsMap>({})
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
    if (!annotations) return
    const newNestedMatchedAnnotationsMap = createMatchedAnnotationsMap(annotations)
    setNestedMatchedAnnotationsMap(newNestedMatchedAnnotationsMap)
  }, [annotations])

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
