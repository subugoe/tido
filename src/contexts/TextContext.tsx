import { createContext, useContext, useState, ReactNode } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

type TextState = {
  hoveredAnnotations: string[] | null
  setHoveredAnnotations: (value: string[] | null) => void
}

// The context carries the store rather than the state: its value is the same object for the life of
// the provider, so reading the context no longer makes a component render again. What a component
// renders for is decided by the selector it subscribes with - a hover somewhere else in the panel
// leaves it alone as long as its own answer has not changed.
const TextStoreContext = createContext<StoreApi<TextState>>(null)

export const TextProvider = ({
  children
}: {
  children: ReactNode
}) => {

  const [store] = useState(() => createStore<TextState>((set) => ({
    hoveredAnnotations: null,
    setHoveredAnnotations: (value) => set({ hoveredAnnotations: value })
  })))

  return (
    <TextStoreContext.Provider value={store}>
      {children}
    </TextStoreContext.Provider>
  )
}

function useTextStore() {
  const store = useContext(TextStoreContext)

  if (!store) throw new Error('useTextStore must be used within a TextProvider')

  return store
}

// The hovered annotations as they are. For the caller that has to look at all of them - the renderer
// deriving the styles of a whole text. Anything asking about a single annotation takes the boolean
// below instead.
export const useHoveredAnnotations = () => useStore(useTextStore(), (state) => state.hoveredAnnotations)

// Whether this one annotation is hovered. The selector returns a boolean, so the subscriber renders
// again only when its own answer flips and not on every pointer move in the panel.
export const useIsAnnotationHovered = (annotationId: string) =>
  useStore(useTextStore(), (state) => state.hoveredAnnotations?.includes(annotationId) ?? false)

// The setter is created once with the store, so subscribing to it never causes a render.
export const useSetHoveredAnnotations = () => useStore(useTextStore(), (state) => state.setHoveredAnnotations)
