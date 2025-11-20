import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { PanelConfig } from '@/types'
import { apiRequest } from '@/utils/api.ts'
interface Props {
  isPrev?: boolean
}

const NavigationButton: FC<Props> = ({ isPrev = false }) => {
  const { panelState, init } = usePanel()

  function navigate() {
    if (isPrev) prev()
    else next()
  }

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

  function next() {
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

  async function prev() {
    const { manifest, item, collectionId, activeContentType } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1
    if (itemIndex === -1) return

    const prevIndex = itemIndex - 1
    const sequence = useDataStore.getState().collections[collectionId].sequence
    let newConfig: PanelConfig = {
      collection: collectionId,
      contentType: activeContentType
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

  return <Button
    variant="ghost"
    size="icon"
    disabled={isPrev ? !hasPrev() : !hasNext()}
    className={`${isPrev ? 'mr-1' : 'ml-1'} rounded-full`}
    onClick={navigate}
    data-cy={isPrev ? 'prev-button': 'next-button'}>
    { isPrev ? <ChevronLeft /> : <ChevronRight /> }
  </Button>
}

export default NavigationButton
