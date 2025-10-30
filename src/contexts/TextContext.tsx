import { createContext, useContext, useState } from 'react'

type TextProviderState = {
  hoveredAnnotation: string | null
  setHoveredAnnotation: (value: string | null) => void
  loadingText: boolean
  setLoadingText: (value: boolean) => void
}

const TextProviderContext = createContext<TextProviderState>(null)

export const TextProvider = ({
  children
}) => {

  const [hoveredAnnotation, setHoveredAnnotation] = useState(null)
  const [loadingText, setLoadingText] = useState(false)

  return (
    <TextProviderContext.Provider value={{
      hoveredAnnotation,
      setHoveredAnnotation,
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
