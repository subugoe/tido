import { ReactNode, createContext, useContext, useState, FC, useEffect } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { selectSyncTargetByIndex } from '@/utils/annotations.ts'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes, isNewManifest, mapToViewIndex } from '@/utils/panel.ts'
import { getSupport } from '@/utils/support-styling.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { useUIStore } from '@/store/UIStore.tsx'
const PanelContext = createContext<PanelContentType | undefined>(undefined)

interface PanelContentType {
  panelId: string
  panelState: PanelState
  loading: boolean
  error: string | null
  setError: (value: string | null) => void
  updatePanel: (data: Partial<PanelState>) => void
  remove: () => void
}

interface PanelProviderProps {
  children?: ReactNode
  panelId: string
}

const PanelProvider: FC<PanelProviderProps> = ({ children, panelId }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const defaultView = useUIStore(state => state.defaultView)
  const getCollection = useDataStore(state => state.initCollection)
  const updateStorePanelState = usePanelStore((state) => state.updatePanel)

  const panelState = usePanelStore(state => state.getPanel(panelId))

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const collection = await getCollection(panelState.config.collection)
        const manifest = await apiRequest<Manifest>(collection.sequence[panelState.config.manifestIndex ?? 0].id)
        const item = await apiRequest<Item>(manifest.sequence[panelState.config.itemIndex ?? 0].id)
        const contentTypes: string[] = getContentTypes(item.content)

        const { support } = manifest

        if (support && support.length > 0 && isNewManifest(manifest)) {
          // Support can be loaded for a new manifest
          await getSupport(support)
        }

        updatePanel( {
          collectionId: collection.id,
          manifest,
          item,
          viewIndex: mapToViewIndex(defaultView),
          contentTypes,
          activeTargetIndex: -1
        })

      } catch (e) {
        setError((e as ErrorResponse).message)
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [panelState.config, panelId])


  useEffect(() => {
    if (!panelId || !panelState) return
    if (panelState.activeTargetIndex > -1) selectSyncTargetByIndex(panelId, panelState.activeTargetIndex)
  }, [panelState?.activeTargetIndex])

  function updatePanel(data: Partial<PanelState>) {
    updateStorePanelState(panelId, data)
  }

  function remove() {
    usePanelStore.getState().removePanel(panelId)
  }

  return (
    <PanelContext.Provider value={{ panelId, panelState, updatePanel, loading, error, setError, remove }}>
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
