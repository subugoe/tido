import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import ManifestMetadata from '@/components/metadata/ManifestMetadata.tsx'


const Metadata: FC = () => {
  const { t } = useTranslation()


  return <div>
    <p className="t-font-bold t-mb-1"> { t('metadata') } </p>
    <p className="t-mb-1 t-text-[14px]"> { t('please_click_to_view_metadata') } </p>
    <div className="t-max-h-[60vh] t-overflow-y-auto">
      <CollectionMetadata />
      <ManifestMetadata />
      <ItemMetadata />
    </div>
  </div>
}

export default Metadata
