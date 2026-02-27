import { createContext, useContext, useState, ReactNode } from 'react'

type TextProviderState = {
  hoveredAnnotations: string[] | null
  setHoveredAnnotations: (value: string[] | null) => void
  loadingText: boolean
  setLoadingText: (value: boolean) => void
}

const TextProviderContext = createContext<TextProviderState>(null)

export const TextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [hoveredAnnotations, setHoveredAnnotations] = useState(null)
  const [loadingText, setLoadingText] = useState(false)

  return (
    <TextProviderContext.Provider value={{
      hoveredAnnotations,
      setHoveredAnnotations,
      loadingText,
      setLoadingText
    }}>
      {children}
    </TextProviderContext.Provider>
  )
}

export const useText = () => {
  const context = useContext(TextProviderContext)

  if (context === undefined)
    throw new Error('useText must be used within a TextProvider')

  return context
}
