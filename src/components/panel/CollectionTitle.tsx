import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'


const CollectionTitle: FC = () => {
  const { panelState } = usePanel()
  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )
  return (
    <>
      { !collection && <Skeleton className="t-w-[100px] t-h-6" /> }
      {collection && <div
        className="t-text-sm t-bg-gray-200 t-px-2 t-py-1 t-rounded-md t-font-semibold t-truncate t-max-w-[200px]"
        title={collection.title[0].title}
      >
        { collection.title[0].title }
      </div>}
    </>

  )
}

export default CollectionTitle
