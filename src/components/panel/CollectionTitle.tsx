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
      { !collection && <Skeleton className="w-[200px] h-6" /> }
      {collection && <div
        className="text-sm bg-gray-200 px-2 py-1 rounded-md font-semibold truncate max-w-[200px]"
        title={collection.title[0].title}
      >
        { collection.title[0].title }
      </div>}
    </>

  )
}

export default CollectionTitle
