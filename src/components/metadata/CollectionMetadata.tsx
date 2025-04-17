import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'


const CollectionMetadata: FC = () => {
  const { panelState } = usePanel()
  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  function getCollectorsName(collection: Collection): string | null {
    if (!collection) return null
    if (collection.collector.length === 0) return null
    if (collection.collector.length === 1) return collection.collector[0].name

    return collection.collector.map((collector) => collector.name).join(', ')
  }

  const collectorsName: string | null = getCollectorsName(collection)
  const  description = collection?.description
  const collectionTitle: Title[] = collection?.title ?? []

  const mappings = {
    main: 'title',
    sub: 'subtitle',
  }

  const metadata = [
    ...collectionTitle
      .filter((c) => c)
      .map((title) => ({
        key: mappings[title.type] || 'title',
        value: title.title,
      })),
    ...(collectorsName ? [{ key: 'collector', value: collectorsName }] : []),
    ...(description ? [{ key: 'description', value: description }] : []),
  ]

  return <div>
    {
      metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
    }
  </div>
}

export default CollectionMetadata
