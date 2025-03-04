import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'


const CollectionTitle: FC = () => {
  const { panelState } = usePanel()
  const collection = useDataStore((state) => state.collections[panelState.collectionId] )
  return (
    <div className="t-text-sm t-bg-gray-200 t-px-2 t-py-1 t-rounded-md t-font-semibold">
      { collection.title[0].title }
    </div>
  )
}

export default CollectionTitle
