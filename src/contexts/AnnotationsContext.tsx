import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  findExternalTargetsInAnnotation,
  findInternalTargetsInAnnotation,
  getFilteredAnnotations,
  getNestedAnnotations
} from '@/utils/annotations.ts'

type State = {
  filteredAnnotations: Annotation[],
  nestedMatchedAnnotationsMap: object,
  setNestedMatchedAnnotationsMap: (newNestedMatchedAnnotationsMap: object) => void,
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

    function updateFilteredAnnotations() {
      const newFiltered: Annotation[] = []
      Object
        .keys(matchedAnnotationsMaps)
        .forEach(contentUrl => {
          newFiltered.push(...getFilteredAnnotations(matchedAnnotationsMaps[contentUrl]))
        })
      setFilteredAnnotations(newFiltered)
    }

    updateFilteredAnnotations()

  }, [matchedAnnotationsMaps])

  useEffect(() => {



    function initNestedMatchedAnnotationsMap(itemAnnotations: Annotation[]) {
      const newNestedMatchedAnnotationsMap: NestedMatchedAnnotationsMap = {}
      itemAnnotations.forEach((annotation) => {
        const nestedAnnotations = getNestedAnnotations(annotation, itemAnnotations)

        const externalTargets = findExternalTargetsInAnnotation(annotation)
        newNestedMatchedAnnotationsMap[annotation.id] = {
          nestedAnnotations,
          externalTargets,
          annotation
        }
      })

      setNestedMatchedAnnotationsMap(newNestedMatchedAnnotationsMap)
    }

    initNestedMatchedAnnotationsMap(panelState.annotations)
  }, [filteredAnnotations, annotationsMode])

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
