import { ReactNode, createContext, useContext, useState, FC } from 'react'
const PanelContext = createContext({ panelId: 'missing' })

interface PanelProvider {
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

function usePanel(): PanelProvider {
  return useContext(PanelContext)
}

export { PanelProvider, usePanel }
