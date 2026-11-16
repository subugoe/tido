import { FC } from 'react'

import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import ManifestMetadata from '@/components/metadata/ManifestMetadata.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'


const Metadata: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <div className="flex flex-col">
    <p className="text-lg font-bold mb-3 pr-10"> { t('metadata') } </p>
    <div className="flex flex-col space-y-4 max-h-[min(60vh,500px)] pr-3 overflow-y-auto" data-cy="metadata-content">
      <CollectionMetadata />
      <ManifestMetadata />
      <ItemMetadata />
    </div>
  </div>
}

export default Metadata
