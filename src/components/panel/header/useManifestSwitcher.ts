import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'

interface ManifestSwitcher {
  manifestOptions: DropdownOption[]
  selectedLabel: string
  isSelecting: boolean
  onManifestSelect: (manifestId: string) => void
  itemOptions: DropdownOption[]
  showItemDropdown: boolean
  setShowItemDropdown: (value: boolean) => void
  onItemSelect: (itemId: string) => void
  onItemDropdownClose: () => void
}

function useManifestSwitcher(): ManifestSwitcher {
  const { panelState, usePanelTranslation, init } = usePanel()
  const { t } = usePanelTranslation()
  const manifest = panelState.manifest
  const collection = useDataStore(s => s.collections[panelState.collectionId])

  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [showItemDropdown, setShowItemDropdown] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [manifestOptions, setManifestOptions] = useState<DropdownOption[]>([])

  const targetManifest = selectedManifest || manifest

  const selectedLabel = useMemo(
    () => selectedManifest?.titles?.[0] ?? panelState?.manifest?.titles?.[0] ?? '',
    [selectedManifest, panelState?.manifest?.titles]
  )

  useEffect(() => {
    async function loadManifestOptions() {
      if (!collection?.manifests) return
      const manifests = await Promise.all(
        collection.manifests.map(async (cur) => {
          const id = typeof cur === 'object' ? cur.id : cur
          const m = await useDataStore.getState().initManifest(id)
          return { id: m.id, label: m.titles?.length > 0 && m.titles[0] || '' }
        })
      )
      setManifestOptions(manifests)
    }
    loadManifestOptions()
  }, [collection])

  const itemOptions = useMemo(() => {
    if (!targetManifest) return []
    return (targetManifest.items || []).map(item => {
      const id = typeof item === 'object' ? item.id : item
      const label = t(typeof item === 'object' ? item.division : id.split('/').pop())
      return { id, label }
    })
  }, [targetManifest, t])

  const onManifestSelect = useCallback(async (manifestId: string) => {
    const manifest = await useDataStore.getState().initManifest(manifestId)
    setSelectedManifest(manifest)
    setIsSelecting(true)
    setShowItemDropdown(true)
  }, [])

  const onItemSelect = useCallback(async (itemId: string) => {
    setIsSelecting(false)
    setSelectedItemId(itemId)

    const targetManifest = selectedManifest || panelState.manifest
    if (!targetManifest) return

    const item = await useDataStore.getState().initItem(itemId)

    if (!item) return

    setShowItemDropdown(false)
    await init({ ...panelState.config, manifest: targetManifest.id, item: item.id, selectedAnnotationId: null })
  }, [selectedManifest, panelState, init])

  const onItemDropdownClose = useCallback(() => {
    setIsSelecting(false)
    if (!selectedItemId) setSelectedManifest(null)
  }, [selectedItemId])

  useEffect(() => {
    if (!collection || !targetManifest) return
    setSelectedItemId(null)
  }, [collection, manifest])

  useEffect(() => {
    setSelectedManifest(null)
    setIsSelecting(false)
  }, [manifest])

  return {
    manifestOptions,
    selectedLabel,
    isSelecting,
    onManifestSelect,
    itemOptions,
    showItemDropdown,
    setShowItemDropdown,
    onItemSelect,
    onItemDropdownClose
  }
}

export { useManifestSwitcher }
export type { ManifestSwitcher }