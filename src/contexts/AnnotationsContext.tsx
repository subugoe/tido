import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getFilteredAnnotations } from '@/utils/annotations.ts'

type MatchedMaps = {[id: string]: MatchedAnnotationsMap}

type State = {
  filteredAnnotations: Annotation[],
  matchedMaps: MatchedMaps,
  updateMatchedMap: (id: string, map: MatchedAnnotationsMap) => void
}

const AnnotationsContext = createContext<State>(null)

export const AnnotationsProvider = ({ children }: { children: ReactNode }) => {
  const { annotations: annotationsConfig } = useConfig()
  const { matchedAnnotationsMaps: textMatchedMaps } = usePanel()
  const [filteredAnnotations, setFilteredAnnotations] = useState<Annotation[]>([])
  const [matchedMaps, setMatchedMaps ] = useState<MatchedMaps>({})

  useEffect(() => {
    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
    const newFiltered: Annotation[] = []
    Object
      .keys(textMatchedMaps)
      .forEach(contentUrl => {
        const filtered = getFilteredAnnotations(textMatchedMaps[contentUrl])
        newFiltered.push(...filtered.filter(a => {
          const body = a.body as AnnotationBody
          return !tooltipTypes.includes(body['x-content-type'])
        }))
      })
    setFilteredAnnotations(newFiltered)
  }, [textMatchedMaps])

  function updateMatchedMap(id: string, map: MatchedAnnotationsMap) {
    setMatchedMaps((prev) => {
      if (map === null) {
        if (prev[id]) {
          // When annotations from the given content url should disappear, remove that key and return the rest
          return Object.keys(prev).reduce((acc: {[contentUrl: string]: MatchedAnnotationsMap}, key) => {
            if (key !== id) acc[key] = prev[key]
            return acc
          }, {})
        }
        // If the given content url was present at all and the caller is trying to add "null" as map,
        // avoid it and return the old value
        return prev
      }

      // If a new value for a map exists, just update it
      return {
        ...prev,
        [id]: map
      }
    })
  }

  return (
    <AnnotationsContext.Provider value={{
      filteredAnnotations,
      matchedMaps,
      updateMatchedMap
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
