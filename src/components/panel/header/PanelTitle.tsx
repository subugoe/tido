import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/header/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/header/ManifestLabel.tsx'
import PrevItemButton from '@/components/panel/navigation/PrevItemButton.tsx'
import NextItemButton from '@/components/panel/navigation/NextItemButton.tsx'
import PrevManifestButton from '@/components/panel/navigation/PrevManifestButton.tsx'
import NextManifestButton from '@/components/panel/navigation/NextManifestButton.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { apiRequest } from '@/utils/api.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import TitleAlertIcon from '@/components/panel/header/TitleAlertIcon.tsx'

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
    const manifest = await apiRequest<Manifest>(manifestId)
    setSelectedManifest(manifest)
    setIsSelecting(true)
    setShowItemDropdown(true)
  }, [])

  const onItemSelect = useCallback(async (itemId: string) => {
    setIsSelecting(false)
    setSelectedItemId(itemId)

    const targetManifest = selectedManifest || panelState.manifest
    if (!targetManifest) return

    const item = await apiRequest<Item>(itemId)

    if (!item) return

    setShowItemDropdown(false)
    await init({ ...panelState.config, manifest: targetManifest.id, item: item.id })
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
          const m = await apiRequest<Manifest>(id)
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

  return (
    <>
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item  &&
          <div className="flex gap-1">
            <BaseTooltip message={t('previous_manifest')}>
              <PrevManifestButton />
            </BaseTooltip>
            <div className="relative">
              <ManifestLabel
                options={manifestOptions}
                selectedLabel={selectedLabel}
                onSelect={onManifestSelect}
                isSelecting={isSelecting}
              />
              {isSelecting && <TitleAlertIcon />}
            </div>
            <BaseTooltip message={t('next_manifest')}>
              <NextManifestButton />
            </BaseTooltip>
          </div>
        }
        <span className="w-[1px] h-[80%] grow-0 shrink-0  bg-gray-400 mx-2"></span>
        <div>
          {(!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />}
          { panelState && panelState.item &&
            <div className="flex items-center gap-1">
              <BaseTooltip message={t('previous_item')}>
                <PrevItemButton />
              </BaseTooltip>
              <ItemLabel
                options={itemOptions}
                onSelect={onItemSelect}
                onDropdownClose={onItemDropdownClose}
                showDropdown={showItemDropdown}
                setShowDropdown={setShowItemDropdown}
              />
              <BaseTooltip message={t('next_item')}>
                <NextItemButton />
              </BaseTooltip>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default PanelTitle
