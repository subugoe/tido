import { createContext, useContext, useState } from 'react'

type TextProviderState = {
  hoveredAnnotation: string | null
  setHoveredAnnotation: (value: string | null) => void
}

const TextProviderContext = createContext<TextProviderState>(null)

export const TextProvider = ({
  children
}) => {

  const [hoveredAnnotation, setHoveredAnnotation] = useState(null)

  return (
    <TextProviderContext.Provider value={{
      hoveredAnnotation,
      setHoveredAnnotation
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
