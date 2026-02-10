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
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1
    if (itemIndex === -1) return

    const prevIndex = itemIndex - 1
    if (prevIndex < 0) {
      const sequence = useDataStore.getState().collections[collectionId].sequence

      const prevManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) - 1
      if (prevManifestIndex < 0) return false
    }

    return true
  }

  async function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1
    if (itemIndex === -1) return

    const prevIndex = itemIndex - 1
    const sequence = useDataStore.getState().collections[collectionId].sequence
    let newConfig: PanelConfig = {
      collection: collectionId,
    }
    if (prevIndex < 0) {
      // If the index is lower than 0, we will load the prev manifest's last item
      const prevManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) - 1
      if (prevManifestIndex < 0) return
      const prevManifest = await apiRequest<Manifest>(sequence[prevManifestIndex].id)

      newConfig = {
        ...newConfig,
        manifest: sequence[prevManifestIndex].id,
        item: prevManifest.sequence[prevManifest.sequence.length - 1].id
      }
    } else {
      // We load the previous item
      newConfig = {
        ...newConfig,
        manifest: manifest.id,
        item: manifest.sequence[prevIndex].id
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
