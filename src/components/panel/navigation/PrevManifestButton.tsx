import { FC, useEffect, useState } from 'react'
import NavigationButton from '@/components/panel/navigation/NavigationButton.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

const PrevManifestButton: FC = () => {
  const { panelState, init } = usePanel()
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(!hasPrev())
  }, [panelState.manifest])

  function hasPrev() {
    const { manifest, item, collectionId } = panelState || {}
    const collection = useDataStore.getState().collections[collectionId]

    if (!collectionId || !manifest || !item) return false

    const manifestIndex = collection?.sequence.findIndex(({ id }) => id === manifest?.id) ?? -1
    if (manifestIndex === -1) return false

    const prevIndex = manifestIndex - 1
    return prevIndex >= 0
  }

  async function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    const collection = useDataStore.getState().collections[collectionId]

    if (!collectionId || !manifest || !item) return

    const manifestIndex = collection?.sequence.findIndex(({ id }) => id === manifest?.id) ?? -1
    if (manifestIndex === -1) return

    const prevIndex = manifestIndex - 1
    const collectionSequence = useDataStore.getState().collections[collectionId].sequence

    if (prevIndex < 0) return

    init({
      collection: collectionId,
      manifest: collectionSequence[prevIndex].id
    })
  }

  return <NavigationButton
    isPrev={true}
    isDisabled={isDisabled}
    navigate={navigate}
    dataCy="prev-manifest-button"
  />

}

export default PrevManifestButton
