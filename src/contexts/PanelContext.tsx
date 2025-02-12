import { ReactNode, createContext, useContext, useState, FC, useEffect } from 'react'
import { panelStore } from '@/store/PanelStore.tsx'
import { selectSyncTargetByIndex } from '@/utils/annotations.ts'
const PanelContext = createContext<PanelContentType | undefined>(undefined)

interface PanelContentType {
  panelId: string
  panelState: PanelState
}

interface PanelProviderProps {
  children?: ReactNode
  id: string
}

const PanelProvider: FC<PanelProviderProps> = ({ children, id }) => {
  const [panelId] = useState<string>(id)
  const panelState = panelStore(state => state.panels[panelId])
  const activeTargetIndex = panelStore(state => state.panels[panelId].activeTargetIndex)

  useEffect(() => {
    selectSyncTargetByIndex(panelId, activeTargetIndex)
  }, [activeTargetIndex])

  return (
    <PanelContext.Provider value={{ panelId, panelState }}>
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
