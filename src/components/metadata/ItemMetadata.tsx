import { FC } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { getItemMetadata } from '@/utils/metadata.ts'


const ItemMetadata: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const item = useDataStore(
    () => panelState && panelState.item ? panelState.item : null
  )

  const metadata = getItemMetadata(item)

  return <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>{ t('item') }</AccordionTrigger>
      <AccordionContent>{ metadata.map((meta, i) => <MetadataItem item={meta} key={i} />) }</AccordionContent>
    </AccordionItem>
  </Accordion>
}

export default ItemMetadata

