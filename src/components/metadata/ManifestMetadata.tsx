import { FC } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTranslation } from 'react-i18next'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { getManifestMetadata } from '@/utils/metadata.ts'


const ManifestMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()

  const manifest = useDataStore(
    () => panelState && panelState.manifest ? panelState.manifest : null
  )

  const metadata = getManifestMetadata(manifest)

  return <div>
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{ t('manifest') }</AccordionTrigger>
        <AccordionContent>
          <div className={'manifest-metadata t-ml-2'}>
            {
              metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
            }
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
}

export default ManifestMetadata

