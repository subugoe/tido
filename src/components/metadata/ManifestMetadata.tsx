import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataSection from '@/components/metadata/MetadataSection.tsx'
import { getManifestMetadata } from '@/utils/metadata.ts'

const ManifestMetadata: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const manifest = useDataStore(
    () => panelState?.manifest ?? null
  )

  const metadata = getManifestMetadata(manifest)

  return <MetadataSection title={t('manifest')} metadata={metadata} />
}

export default ManifestMetadata
