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

    const itemIndex = manifest?.items?.findIndex((cur) => {
      const id = typeof cur === 'object' ? item.id : cur
      return id === item?.id
    }) ?? -1
    if (itemIndex === -1) return false

    const prevIndex = itemIndex - 1
    if (prevIndex < 0) {
      const manifests = useDataStore.getState().collections[collectionId].manifests

      const prevManifestIndex = manifests.findIndex((cur) => {
        const id = typeof cur === 'object' ? cur.id : cur
        return id === manifest.id
      }) - 1
      if (prevManifestIndex < 0) return false
    }
    return true
  }

  async function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.items?.findIndex((cur) => {
      const id = typeof cur === 'object' ? cur.id : cur
      return id === item?.id
    }) ?? -1

    if (itemIndex === -1) return

    const prevIndex = itemIndex - 1
    const manifests = useDataStore.getState().collections[collectionId].manifests
    let newConfig: PanelConfig = {
      collection: collectionId,
    }

    if (prevIndex < 0) {
      // If the index is lower than 0, we will load the prev manifest's last item
      const prevManifestIndex = manifests.findIndex((cur) => {
        const id = typeof cur === 'object' ? cur.id : cur
        return id === manifest.id
      }) - 1
      if (prevManifestIndex < 0) return

      const prevMmanifestId = typeof manifests[prevManifestIndex] === 'object'
        ? (manifests[prevManifestIndex] as Manifest).id
        : (manifests[prevManifestIndex] as string)

      const prevManifest = await apiRequest<Manifest>(prevMmanifestId)

      // Get the last item ID from the previous manifest
      const lastItem = prevManifest.items?.[prevManifest.items.length - 1]
      if (!lastItem) return

      const itemId = typeof lastItem === 'object'
        ? (lastItem as Item).id
        : lastItem

      newConfig = {
        ...newConfig,
        manifest: prevMmanifestId,
        item: itemId
      }
    } else {
      // We load the previous item
      const prevItem = manifest.items?.[prevIndex]
      if (!prevItem) return

      const itemId = typeof prevItem === 'object'
        ? (prevItem as Item).id
        : prevItem

      newConfig = {
        ...newConfig,
        manifest: manifest.id,
        item: itemId
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
