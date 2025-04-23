import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import ManifestMetadata from '@/components/metadata/ManifestMetadata.tsx'



const Metadata: FC = () => {
  const { t } = useTranslation()


  return <div className="t-w-[93%]">
    <p className={'t-font-bold t-mb-1'}> { t('metadata') } </p>
    <p className={'t-mb-2 t-text-[14px]'}> { t('please_click_to_view_metadata') } </p>
    <CollectionMetadata />
    <ManifestMetadata />
    <ItemMetadata />
  </div>
}

export default Metadata
