import { FC } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTranslation } from 'react-i18next'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'

import { getCollectorsName, getCollectionMetadata } from '@/utils/metadata.ts'

const CollectionMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()

  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  const collectorsName: string | null = getCollectorsName(collection)
  const  description = collection?.description
  const collectionTitle: Title[] = collection?.title ?? []

  const metadata = getCollectionMetadata(collectionTitle, collectorsName, description)


  return <div>
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{ t('collection') }</AccordionTrigger>
        <AccordionContent>
          <div className={'collection-metadata t-ml-2'}>
            {
              metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
            }
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
}

export default CollectionMetadata
