import { FC } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTranslation } from 'react-i18next'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { getItemMetadata } from '@/utils/metadata.ts'


const ItemMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()

  const item = useDataStore(
    () => panelState && panelState.item ? panelState.item : null
  )

  const metadata = getItemMetadata(item)

  return <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger className="t-relative [&>svg]:t-absolute [&>svg]:t-right-3">{ t('item') }</AccordionTrigger>
      <AccordionContent>
        <div className="t-ml-2"> { metadata.map((meta, i) => <MetadataItem item={meta} key={i} />) }</div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
}

export default ItemMetadata

