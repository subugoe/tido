import { ReactNode, createContext, useContext, useState, FC } from 'react'
const PanelContext = createContext<PanelContentType | undefined>(undefined)

interface PanelContentType {
  panelId: string
}

interface PanelProviderProps {
  children?: ReactNode
  id: string
}

const PanelProvider: FC<PanelProviderProps> = ({ children, id }) => {
  const [panelId] = useState<string>(id)

  return (
    <PanelContext.Provider value={{ panelId }}>
      {children}
    </PanelContext.Provider>
  )
}

function usePanel(): PanelContentType {
  const context =  useContext(PanelContext)
  if (!context) {
    throw new Error('usePanel must be used inside the PanelProvider')
  }

  return context
}

export { PanelProvider, usePanel }
