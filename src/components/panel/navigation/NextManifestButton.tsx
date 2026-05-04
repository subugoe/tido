import { FC, useEffect, useState } from 'react'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig } from '@/types'
import NavigationButton from '@/components/panel/navigation/NavigationButton.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

const NextManifestButton: FC = () => {
  const { panelState, init } = usePanel()
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(!hasNext())
  }, [panelState.manifest])

  function hasNext() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return false

    const collection = useDataStore.getState().collections[collectionId]

    const manifestIndex = collection?.manifests.findIndex((id) => id === manifest?.id) ?? -1
    if (manifestIndex === -1) return

    const nextIndex = manifestIndex + 1
    return nextIndex <= collection.manifests.length - 1
  }

  function navigate() {
    const { manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return
    const collection = useDataStore.getState().collections[collectionId]

    const manifestIndex = collection?.manifests.findIndex((id) => id === manifest?.id) ?? -1

    if (manifestIndex === -1) return

    const nextIndex = manifestIndex + 1
    const manifests = collection.manifests
    let newConfig: PanelConfig = {
      collection: collectionId,
    }

    if (nextIndex > manifests.length - 1) return

    newConfig = {
      collection: collectionId,
      manifest: manifests[nextIndex],
    }

    init(newConfig)
  }


  return <NavigationButton
    isDisabled={isDisabled}
    navigate={navigate}
    dataCy="next-manifest-button"
  />

}

export default NextManifestButton
