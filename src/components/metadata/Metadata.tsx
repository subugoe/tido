import { FC } from 'react'

import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import ManifestMetadata from '@/components/metadata/ManifestMetadata.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'


const Metadata: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <div>
    <p className="font-bold mb-1"> { t('metadata') } </p>
    <p className="mb-2 text-[14px]"> { t('please_click_to_view_metadata') } </p>
    <div className="flex flex-col space-y-2 max-h-[60vh] pr-3 overflow-y-auto">
      <CollectionMetadata />
      <ManifestMetadata />
      <ItemMetadata />
    </div>
  </div>
}

export default Metadata
