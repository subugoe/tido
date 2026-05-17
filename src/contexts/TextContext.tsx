import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from 'react'

type TextProviderState = {
  hoveredAnnotations: string[] | null
  setHoveredAnnotations:  Dispatch<SetStateAction<string[]>>
  loadingText: boolean
  setLoadingText: (value: boolean) => void
}

const TextProviderContext = createContext<TextProviderState>(null)

export const TextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [hoveredAnnotations, setHoveredAnnotations] = useState<string[] | null>(null)
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
