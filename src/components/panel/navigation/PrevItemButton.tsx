import { FC, useEffect, useState } from 'react'
import NavigationButton from '@/components/panel/navigation/NavigationButton.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig } from '@/types'
import { apiRequest } from '@/utils/api.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'

const PrevItemButton: FC = () => {
  const { panelState, init } = usePanel()
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(!hasPrev())
  }, [panelState.item])

  function hasPrev() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return false

    const itemIndex = manifest?.items?.findIndex((id) => id === item?.id) ?? -1
    if (itemIndex === -1) return false

    const prevIndex = itemIndex - 1
    if (prevIndex < 0) {
      const manifests = useDataStore.getState().collections[collectionId].manifests

      const prevManifestIndex = manifests.findIndex((id) => id === manifest.id) - 1
      if (prevManifestIndex < 0) return false
    }
    return true
  }

  async function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.items?.findIndex((id) => id === item?.id) ?? -1

    if (itemIndex === -1) return

    const prevIndex = itemIndex - 1
    const manifests = useDataStore.getState().collections[collectionId].manifests
    let newConfig: PanelConfig = {
      collection: collectionId,
    }

    if (prevIndex < 0) {
      // If the index is lower than 0, we will load the prev manifest's last item
      const prevManifestIndex = manifests.findIndex((id) => id === manifest.id) - 1
      if (prevManifestIndex < 0) return
      const prevManifest = await apiRequest<Manifest>(manifests[prevManifestIndex])

      // Get the last item ID from the previous manifest
      const lastItemId = prevManifest.items?.[prevManifest.items.length - 1]
      if (!lastItemId) return

      newConfig = {
        ...newConfig,
        manifest: manifests[prevManifestIndex],
        item: lastItemId
      }
    } else {
      // We load the previous item
      const prevItemId = manifest.items?.[prevIndex]
      if (!prevItemId) return

      newConfig = {
        ...newConfig,
        manifest: manifest.id,
        item: prevItemId
      }
    }

    init(newConfig)
  }

  return <NavigationButton
    isPrev={true}
    isDisabled={isDisabled}
    navigate={navigate}
    dataCy="prev-item-button"
  />

}

export default PrevItemButton
