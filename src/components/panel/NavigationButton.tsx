import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
interface Props {
  isPrev?: boolean
}

const NavigationButton: FC<Props> = ({ isPrev = false }) => {
  const { panelState, updatePanel } = usePanel()

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
      const sequence = useDataStore.getState().collections[collectionId].collection.sequence

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
      const sequence = useDataStore.getState().collections[collectionId].collection.sequence

      const nextManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) + 1
      if (nextManifestIndex > sequence.length - 1) return false
    }
    return true
  }

  function next() {
    const { config, manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1

    if (itemIndex === -1) return

    const nextIndex = itemIndex + 1
    if (nextIndex > manifest?.sequence.length - 1) {
      const sequence = useDataStore.getState().collections[collectionId].collection.sequence

      const nextManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) + 1
      if (nextManifestIndex > sequence.length - 1) return

      updatePanel({ config: {
        ...config,
        manifestIndex: nextManifestIndex,
        itemIndex: 0
      } })
    } else {
      updatePanel({ config: {
        ...config,
        itemIndex: nextIndex
      } })
    }
  }

  async function prev() {
    const { config, manifest, item, collectionId } = panelState || {}
    if (!collectionId || !manifest || !item) return

    const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1
    if (itemIndex === -1) return

    const prevIndex = itemIndex - 1

    if (prevIndex < 0) {
      const sequence = useDataStore.getState().collections[collectionId].collection.sequence

      // If the index is lower than 0, we will load the prev manifest's last item
      const prevManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) - 1
      if (prevManifestIndex < 0) return
      const prevManifest = await apiRequest<Manifest>(sequence[prevManifestIndex].id)

      updatePanel({ config: {
        ...config,
        manifestIndex: prevManifestIndex,
        itemIndex: prevManifest.sequence.length - 1
      } })
    } else {
      // We load the previous item
      updatePanel({ config: {
        ...config,
        itemIndex: prevIndex
      } })
    }
  }

  return <Button
    variant="ghost"
    size="icon"
    disabled={isPrev ? !hasPrev() : !hasNext()}
    className={`${isPrev ? 'mr-1' : 'ml-1'} rounded-full`}
    onClick={navigate}>
    { isPrev ? <ChevronLeft /> : <ChevronRight /> }
  </Button>
}

export default NavigationButton
