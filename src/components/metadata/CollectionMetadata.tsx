import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataSection from '@/components/metadata/MetadataSection.tsx'
import { getCollectionMetadata } from '@/utils/metadata.ts'

const CollectionMetadata: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const collectionId = panelState?.collectionId ?? null
  const collection = useDataStore(
    (state) => collectionId ? state.collections[collectionId] ?? null : null
  )

  const metadata = getCollectionMetadata(collection)

  return <MetadataSection title={t('collection')} metadata={metadata} />
}

export default CollectionMetadata
