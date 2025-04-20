import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'

import { getCollectorsName, getCollectionMetadata } from '@/utils/metadata.ts'

const CollectionMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const [showMetadata, setShowMetadata] = useState(false)

  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  const collectorsName: string | null = getCollectorsName(collection)
  const  description = collection?.description
  const collectionTitle: Title[] = collection?.title ?? []

  const metadata = getCollectionMetadata(collectionTitle, collectorsName, description)

  return <div>
    <Button variant={'secondary'} title={t('please_click_to_view_metadata')} className="t-h-10 t-text-xl t-font-semibold  t-mb-2 t-w-1/2 t-outline-none hover:t-bg-gray-200"
      onClick={() => setShowMetadata(!showMetadata)}>
      { t('collection') }
    </Button>

    { showMetadata && <div
      className={'collection-metadata t-ml-4'}>
      {
        metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>}


  </div>
}

export default CollectionMetadata
