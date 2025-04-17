import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { useTranslation } from 'react-i18next'
import { getCollectorsName } from '@/utils/metadata.ts'
import metadataItem from '@/components/metadata/MetadataItem.tsx'

const CollectionMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  const collectorsName: string | null = getCollectorsName(collection)
  const  description = collection?.description
  const collectionTitle: Title[] = collection?.title ?? []

  const mappings = {
    main: 'title',
    sub: 'subtitle',
  }

  const metadata = [
    ...collectionTitle
      .map((title) => ({
        key: t(mappings[title.type] || 'title'),
        value: title.title,
      })),
    ...(collectorsName ? [{ key: 'collector', value: collectorsName }] : []),
    ...(description ? [{ key: 'description', value: description }] : []),
  ]

  console.log('metadata', metadata)


  return <div>
    <h3 className="t-text-xl t-font-semibold t-mb-2">
      {t('collection')}
    </h3>
    <div className="collection-metadata t-ml-1">
      {
        metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>

  </div>
}

export default CollectionMetadata
