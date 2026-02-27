import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { getFilteredAnnotations } from '@/utils/annotations.ts'

type State = {
  filteredAnnotations: Annotation[]
}

const AnnotationsContext = createContext<State>(null)

export const AnnotationsProvider = ({ children }: { children: ReactNode }) => {
  const { matchedAnnotationsMaps } = usePanel()
  const [filteredAnnotations, setFilteredAnnotations] = useState<Annotation[]>([])


  useEffect(() => {
    const newFiltered: Annotation[] = []
    Object
      .keys(matchedAnnotationsMaps)
      .forEach(contentUrl => {
        newFiltered.push(...getFilteredAnnotations(matchedAnnotationsMaps[contentUrl]))
      })
    setFilteredAnnotations(newFiltered)
  }, [matchedAnnotationsMaps])

  return (
    <AnnotationsContext.Provider value={{
      filteredAnnotations
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
