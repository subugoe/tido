import { FC, useEffect, useState } from 'react'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig } from '@/types'
import NavigationButton from '@/components/panel/navigation/NavigationButton.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

const NextItemButton: FC = () => {
  const { panelState, init } = usePanel()
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(!hasNext())
  }, [panelState.item])

  function hasNext() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return false

    const itemIndex = manifest?.items?.findIndex((id) => id === item?.id) ?? -1
    if (itemIndex === -1) return false

    const nextIndex = itemIndex + 1
    if (nextIndex > (manifest.items?.length ?? 0) - 1) {
      const manifests = useDataStore.getState().collections[collectionId].manifests

      const nextManifestIndex = manifests.findIndex((id) => id === manifest.id) + 1
      if (nextManifestIndex > manifests.length - 1) return false
    }
    return true
  }

  async function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.items?.findIndex((id) => id === item?.id) ?? -1

    if (itemIndex === -1) return

    const nextIndex = itemIndex + 1
    const manifests = useDataStore.getState().collections[collectionId].manifests
    let newConfig: PanelConfig = {
      collection: collectionId,
    }

    if (nextIndex > (manifest.items?.length ?? 0) - 1) {
      const nextManifestIndex = manifests.findIndex((id) => id === manifest.id) + 1
      if (nextManifestIndex > manifests.length - 1) return

      newConfig = {
        ...newConfig,
        manifest: manifests[nextManifestIndex]
      }
    } else {
      const nextItemId = manifest.items?.[nextIndex]
      if (!nextItemId) return

      newConfig = {
        ...newConfig,
        manifest: manifest.id,
        item: nextItemId
      }
    }

    init(newConfig)
  }

  return <NavigationButton
    isDisabled={isDisabled}
    navigate={navigate}
    dataCy="next-item-button"
  />

}

export default NextItemButton
