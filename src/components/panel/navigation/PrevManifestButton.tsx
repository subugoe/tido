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

    const manifestIndex = collection?.manifests.findIndex((cur) => {
      const id = typeof cur === 'object' ? cur.id : cur
      return id === manifest?.id
    }) ?? -1
    if (manifestIndex === -1) return false

    const prevIndex = manifestIndex - 1
    return prevIndex >= 0
  }

  async function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    const collection = useDataStore.getState().collections[collectionId]

    if (!collectionId || !manifest || !item) return

    const manifestIndex = collection?.manifests.findIndex((cur) => {
      const id = typeof cur === 'object' ? cur.id : cur
      return id === manifest?.id
    }) ?? -1
    if (manifestIndex === -1) return

    const prevIndex = manifestIndex - 1
    const manifests = collection.manifests

    if (prevIndex < 0) return

    const manifestId = typeof manifests[prevIndex] === 'object'
      ? (manifests[prevIndex] as Manifest).id
      : (manifests[prevIndex] as string)

    init({
      collection: collectionId,
      manifest: manifestId
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
