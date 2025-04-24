import { FC } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTranslation } from 'react-i18next'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'

import { getCollectionMetadata } from '@/utils/metadata.ts'

const CollectionMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()

  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  const metadata = getCollectionMetadata(collection?.title, collection?.collector, collection?.description)


  return <div>
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" >
        <AccordionTrigger className="t-py-1 [&>svg]:t-absolute [&>svg]:t-right-3">{ t('collection') }</AccordionTrigger>
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
