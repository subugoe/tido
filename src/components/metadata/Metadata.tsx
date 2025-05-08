import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import ManifestMetadata from '@/components/metadata/ManifestMetadata.tsx'


const Metadata: FC = () => {
  const { t } = useTranslation()


  return <div>
    <p className="font-bold mb-1"> { t('metadata') } </p>
    <p className="mb-2 text-[14px]"> { t('please_click_to_view_metadata') } </p>
    <div className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto mb-2">
      <CollectionMetadata />
      <ManifestMetadata />
      <ItemMetadata />
    </div>
  </div>
}

export default Metadata
