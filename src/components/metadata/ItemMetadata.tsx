import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { useTranslation } from 'react-i18next'

const ItemMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const item = useDataStore(
    () => panelState && panelState.item ? panelState.item : null
  )


  const metadata = [
    { key: 'label', value: item?.n },
    { key: 'language', value: item?.lang?.join(',') },
    { key: 'image_license', value: item?.image?.license?.id },
    { key: 'image_notes', value: item?.image?.license?.notes },
  ].filter(i => i.value)


  return <div>
    <h3 className="t-text-xl t-font-semibold t-mb-2">
      {t('item')}
    </h3>
    <div className="item-metadata t-ml-1">
      {
        metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>

  </div>
}

export default ItemMetadata


