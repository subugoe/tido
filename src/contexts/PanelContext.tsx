import { ReactNode, createContext, useContext, useState, FC, useEffect } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { selectSyncTargetByIndex } from '@/utils/annotations.ts'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes, isNewManifest } from '@/utils/panel.ts'
import { getSupport } from '@/utils/support-styling.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { PanelConfig, ViewType } from '@/types'
const PanelContext = createContext<PanelContentType | undefined>(undefined)

interface PanelContentType {
  panelId: string | null
  panelState: PanelState | null
  loading: boolean
  error: string | null
  setError: (value: string | null) => void
  updatePanelState: (data: Partial<PanelState>) => void
  remove: () => void
}

interface PanelProviderProps {
  children?: ReactNode
  panelConfig: PanelConfig
  index: number
}

const PanelProvider: FC<PanelProviderProps> = ({ children, panelConfig, index }) => {
  const [panelId, setPanelId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const defaultView = useConfigStore.getState().config.defaultView
  const getCollection = useDataStore(state => state.initCollection)
  const initPanelState = usePanelStore((state) => state.initPanelState)
  const updateStorePanelState = usePanelStore((state) => state.updatePanelState)
  const removePanel = usePanelStore(state => state.removePanel)

  const panelState = usePanelStore(state => state.getPanelState(panelId))

  useEffect(() => {
    // On first render, create a new panel ID and initiate the panel in an empty state
    const id = crypto.randomUUID()
    setPanelId(id)
    initPanelState(id, index)
  }, [])

  useEffect(() => {
    if (!panelId) return
    const init = async () => {
      setLoading(true)
      try {
        const collection = await getCollection(panelConfig.collection)
        const manifest = await apiRequest<Manifest>(collection.sequence[panelConfig.manifestIndex ?? 0].id)
        const item = await apiRequest<Item>(manifest.sequence[panelConfig.itemIndex ?? 0].id)
        const contentTypes: string[] = getContentTypes(item.content)

        const { support } = manifest

        if (support && support.length > 0 && isNewManifest(manifest)) {
          // Support can be loaded for a new manifest
          await getSupport(support)
        }

        updateStorePanelState(panelId, {
          collectionId: collection.id,
          manifest,
          item,
          contentIndex: 0,
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
  }, [panelConfig, panelId])


  useEffect(() => {
    if (!panelId || !panelState) return
    if (panelState.activeTargetIndex > -1) selectSyncTargetByIndex(panelId, panelState.activeTargetIndex)
  }, [panelState?.activeTargetIndex])

  function updatePanelState(data: Partial<PanelState>) {
    if (!panelId) return
    updateStorePanelState(panelId, data)
  }

  function mapToViewIndex(view: ViewType): number {
    if (view === 'pip') return 0
    if (view === 'split') return 1
    if (view === 'text') return 2
    if (view === 'image') return 3
    return 0
  }

  function remove() {
    if (!panelId) return
    removePanel(panelId)
    useConfigStore.getState().removePanel(index)
  }

  return (
    <PanelContext.Provider value={{ panelId, panelState, updatePanelState, loading, error, setError, remove }}>
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
