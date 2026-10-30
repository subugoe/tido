import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { getFilteredAnnotations } from '@/utils/annotations.ts'
import { getContentUrlByType } from '@/utils/text.ts'
import { PanelView } from '@/types'
import { getAnnotationType } from '@/utils/annotation-data.ts'
import { CustomError } from '@/utils/custom-error.ts'

type MatchedMaps = {[id: string]: MatchedAnnotationsMap}

type State = {
  // Computed in PanelContext via useFilteredAnnotations, passed through for the sidebar components
  filteredAnnotations: Annotation[],
  matchedMaps: MatchedMaps,
  updateMatchedMap: (id: string, map: MatchedAnnotationsMap) => void,
  alignmentLoading: boolean,
  setAlignmentLoading: (value: boolean) => void
}

const AnnotationsContext = createContext<State>(null)

// Deduplicated in case two views show the same text.
function getVisibleContentUrls(panelViews: PanelView[] | undefined, contents: Content[] | undefined): string[] {
  return [...new Set(
    (panelViews ?? [])
      .filter(view => view.view === 'text' && (view.visible ?? true))
      .map(view => getContentUrlByType(contents ?? [], view.activeContentType))
      .filter(Boolean)
  )]
}

// Derives the filtered annotations of the visible text views (in panelViews order), without tooltip types.
// It is called from PanelProvider, so the result is part of PanelContext and available outside the sidebar
// (e.g. for the header badge)
export function useFilteredAnnotations(
  textMatchedMaps: MatchedMaps,
  panelViews: PanelView[] | undefined,
  contents: Content[] | undefined,
  tooltipTypes: string[] | undefined
): Annotation[] {
  return useMemo(() => {
    return getVisibleContentUrls(panelViews, contents).flatMap(contentUrl => {
      const map = textMatchedMaps[contentUrl]
      if (!map) return []
      return getFilteredAnnotations(map).filter(a => !(tooltipTypes ?? []).includes(getAnnotationType(a)))
    })
  }, [textMatchedMaps, panelViews, contents, tooltipTypes])
}

// True while the filtered annotations are not final yet: the panel is still loading, or a visible text has
// not been matched against the item's annotations. Without an annotation collection, or when it could not
// be loaded, no match is waited for.
export function useAnnotationsPending(
  textMatchedMaps: MatchedMaps,
  panelViews: PanelView[] | undefined,
  item: Item | undefined,
  loading: boolean,
  annotationsError: CustomError | null
): boolean {
  return useMemo(() => {
    if (loading) return true
    if (!item?.annotationCollection || annotationsError) return false
    return getVisibleContentUrls(panelViews, item.contents).some(contentUrl => !textMatchedMaps[contentUrl])
  }, [textMatchedMaps, panelViews, item, loading, annotationsError])
}

export const AnnotationsProvider = ({ children }: { children: ReactNode }) => {
  const { annotationsMode, filteredAnnotations } = usePanel()
  const [alignmentLoading, setAlignmentLoading] = useState(false)
  const [matchedMaps, setMatchedMaps ] = useState<MatchedMaps>({})

  useEffect(() => {
    if (annotationsMode === 'aligned') setAlignmentLoading(true)
  }, [annotationsMode])

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
      updateMatchedMap,
      alignmentLoading,
      setAlignmentLoading
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
