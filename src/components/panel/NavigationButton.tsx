import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { ChevronRight } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import { apiRequest } from '@/utils/api.ts'
interface Props {
  isPrev?: boolean
}

function next(panelState: PanelState) {
  const { manifest, item, collectionId, index: panelIndex } = panelState || {}
  if (!collectionId || !manifest || !item) return

  const itemIndex = manifest?.sequence.findIndex(({ id }) => id === item?.id) ?? -1

  if (itemIndex === -1) return

  const nextIndex = itemIndex + 1
  if (nextIndex > manifest?.sequence.length - 1) {
    const sequence = useDataStore.getState().collections[collectionId].collection.sequence

    const nextManifestIndex = sequence.findIndex(({ id }) => id === manifest.id) + 1
    if (nextManifestIndex > sequence.length - 1) return

    useConfigStore.getState().updatePanel({
      manifestIndex: nextManifestIndex,
      itemIndex: 0
    }, panelIndex)
  } else {
    useConfigStore.getState().updatePanel({
      itemIndex: nextIndex
    }, panelIndex)
  }
}

async function prev(panelState: PanelState) {
  const { manifest, item, collectionId, index: panelIndex } = panelState || {}
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

    useConfigStore.getState().updatePanel({
      manifestIndex: prevManifestIndex,
      itemIndex: prevManifest.sequence.length - 1
    }, panelIndex)
  } else {
    // We load the previous item
    useConfigStore.getState().updatePanel({
      itemIndex: prevIndex
    }, panelIndex)
  }
}



const NavigationButton: FC<Props> = ({ isPrev = false }) => {
  const { panelState } = usePanel()

  function navigate() {
    if (!panelState) return
    if (isPrev) prev(panelState)
    else next(panelState)
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

  return <Button variant="ghost" size="icon" disabled={isPrev ? !hasPrev() : !hasNext()} className={`${isPrev ? 't-rotate-180 t-mr-1' : 't-ml-1'} t-rounded-full t-mt-1`} onClick={navigate}><ChevronRight /></Button>
}

export default NavigationButton
