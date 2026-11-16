import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataSection from '@/components/metadata/MetadataSection.tsx'
import { getItemMetadata } from '@/utils/metadata.ts'


const ItemMetadata: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const item = useDataStore(
    () => panelState?.item ?? null
  )

  const metadata = getItemMetadata(item)

  return <MetadataSection title={t('item')} metadata={metadata} />
}

export default ItemMetadata
