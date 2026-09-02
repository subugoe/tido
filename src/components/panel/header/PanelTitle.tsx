import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/header/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/header/ManifestLabel.tsx'
import PrevItemButton from '@/components/panel/navigation/PrevItemButton.tsx'
import NextItemButton from '@/components/panel/navigation/NextItemButton.tsx'
import PrevManifestButton from '@/components/panel/navigation/PrevManifestButton.tsx'
import NextManifestButton from '@/components/panel/navigation/NextManifestButton.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { ButtonGroup } from '@/components/ui/button-group.tsx'

const PanelTitle: FC = () => {
  const { panelState, usePanelTranslation, init } = usePanel()
  const collection = useDataStore(s => s.collections[panelState.collectionId])
  const manifest = panelState.manifest

  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [showItemDropdown, setShowItemDropdown] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [manifestOptions, setManifestOptions] = useState<DropdownOption[]>([])

  const { t } = usePanelTranslation()
  const targetManifest = selectedManifest || manifest

  const selectedLabel = useMemo(
    () => selectedManifest?.titles?.[0] ?? panelState?.manifest?.titles?.[0] ?? '',
    [selectedManifest, panelState?.manifest?.titles]
  )

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

  useEffect(() => {
    if (!collection || !targetManifest) return
    setSelectedItemId(null)
  }, [collection, manifest])

  useEffect(() => {
    setSelectedManifest(null)
    setIsSelecting(false)
  }, [manifest])

  const hasManifest = panelState && panelState.manifest

  return (
    <div className="flex items-center gap-1 min-w-0">
      {(!panelState || !panelState.manifest) && !collection && (
        <Skeleton className="w-[100px] h-6" />
      )}
      {hasManifest && (
        <div className="flex items-center shrink-0">
          <ButtonGroup className="h-7">
            <PrevManifestButton />
            <ManifestLabel
              options={manifestOptions}
              selectedLabel={selectedLabel}
              onSelect={onManifestSelect}
              isSelecting={isSelecting}
            />
            <NextManifestButton />
          </ButtonGroup>
        </div>
      )}
      {(!panelState || !panelState.manifest) && collection && (
        <Skeleton className="w-[60px] h-6" />
      )}
      {panelState && panelState.manifest && (
        <ButtonGroup className="h-7 shrink-0">
          <PrevItemButton />
          <ItemLabel
            options={itemOptions}
            onSelect={onItemSelect}
            onDropdownClose={onItemDropdownClose}
            showDropdown={showItemDropdown}
            setShowDropdown={setShowItemDropdown}
          />
          <NextItemButton />
        </ButtonGroup>
      )}
    </div>
  )
}

export default PanelTitle
