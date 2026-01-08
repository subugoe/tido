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
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1
    if (itemIndex === -1) return

    const nextIndex = itemIndex + 1
    if (nextIndex > manifest.sequence.length - 1) {
      const sequence = useDataStore.getState().collections[collectionId].sequence

      const nextManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) + 1
      if (nextManifestIndex > sequence.length - 1) return false
    }
    return true
  }

  function navigate() {
    const { manifest, item, collectionId, activeContentType } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1

    if (itemIndex === -1) return

    const nextIndex = itemIndex + 1
    const sequence = useDataStore.getState().collections[collectionId].sequence
    let newConfig: PanelConfig = {
      collection: collectionId,
      contentType: activeContentType
    }

    if (nextIndex > manifest?.sequence.length - 1) {
      const nextManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) + 1
      if (nextManifestIndex > sequence.length - 1) return

      newConfig = {
        ...newConfig,
        manifest: sequence[nextManifestIndex].id
      }
    } else {
      newConfig = {
        ...newConfig,
        manifest: manifest.id,
        item: manifest.sequence[nextIndex].id,
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
