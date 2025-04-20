import { FC } from 'react'
import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import { useTranslation } from 'react-i18next'



const Metadata: FC = () => {

  const { t } = useTranslation()


  return <div>
    <p className={'t-font-bold t-mb-2'}> { t('please_click_to_view_metadata') } </p>
    <CollectionMetadata />
    <ItemMetadata />
  </div>
}

export default Metadata
