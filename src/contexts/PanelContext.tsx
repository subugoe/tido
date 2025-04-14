import { ReactNode, createContext, useContext, useState, FC, useEffect } from 'react'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { selectSyncTargetByIndex } from '@/utils/annotations.ts'
import { apiRequest } from '@/utils/api.ts'
import { getContentTypes, isNewManifest } from '@/utils/panel.ts'
import { includesCollectionAsNested, isCollectionInTree } from '@/utils/tree.ts'
import { getSupport } from '@/utils/support-styling.ts'
import { useDataStore } from '@/store/DataStore.tsx'


const PanelContext = createContext<PanelContentType | undefined>(undefined)


interface PanelContentType {
  panelId: string | null
  panelState: PanelState | null
  loading: boolean
  error: string | null
  updatePanelState: (data: Partial<PanelState>) => void
}

interface PanelProviderProps {
  children?: ReactNode
  panelConfig: PanelConfig
  index: number
}

const PanelProvider: FC<PanelProviderProps> = ({ children, panelConfig, index }) => {
  const [panelId, setPanelId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCollection = useDataStore(state => state.initCollection)
  const initPanelState = usePanelStore((state) => state.initPanelState)
  const updateStorePanelState = usePanelStore((state) => state.updatePanelState)

  const panelState = usePanelStore(state => state.getPanelState(panelId))


  useEffect(() => {

    // On first render, create a new panel ID and initiate the panel in an empty state
    const id = crypto.randomUUID()
    setPanelId(id)
    initPanelState(id, index)
  }, [initPanelState])

  useEffect(() => {
    init()
  }, [panelConfig, panelId])

  const init = async () => {

    if (!panelId) return
    try {
      setLoading(true)
      // add a condition to perform getCollection as many times as we find one collection which has a sequence of manifests
      let collectionId: string = panelConfig.collection
      let collection: Collection = { '@context': '', collector: [], id: '', sequence: [], textapi: '', title: [] }

      // getLeafCollection()
      while (true) {
        collection = await getCollection(collectionId)
        if (collection.sequence[0].type === 'manifest') break
        collectionId = collection.sequence[0].id
      }


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
        viewIndex: 0,
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

  useEffect(() => {
    if (!panelId || !panelState) return
    if (panelState.activeTargetIndex > -1) selectSyncTargetByIndex(panelId, panelState.activeTargetIndex)
  }, [panelState?.activeTargetIndex])

  function updatePanelState(data: Partial<PanelState>) {
    if (!panelId) return
    updateStorePanelState(panelId, data)
  }

  return (
    <PanelContext.Provider value={{ panelId, panelState, updatePanelState, loading, error }}>
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
