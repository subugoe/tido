import { FC } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'

import { getCollectionMetadata } from '@/utils/metadata.ts'

const CollectionMetadata: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const collection = useDataStore(
    (state) => panelState && panelState.collectionId ? state.collections[panelState.collectionId].collection : null
  )

  const metadata = getCollectionMetadata(collection)


  return <Accordion type="single" collapsible>
    <AccordionItem value="item-1" >
      <AccordionTrigger>{ t('collection') }</AccordionTrigger>
      <AccordionContent>{ metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)}</AccordionContent>
    </AccordionItem>
  </Accordion>
}

export default CollectionMetadata
