import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import MetadataItem from '@/components/metadata/MetadataItem.tsx'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.tsx'

const ItemMetadata: FC = () => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const [showMetadata, setShowMetadata] = useState(false)

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
    <Button variant={'secondary'} title={t('please_click_to_view_metadata')} className="t-h-10 t-text-xl t-font-semibold t-mb-2 t-w-1/2 t-outline-none hover:t-bg-gray-200"
      onClick={() => setShowMetadata(!showMetadata)}>
      { t('item') }
    </Button>
    { showMetadata && <div className="item-metadata t-ml-4">
      {
        metadata.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>}
  </div>
}

export default ItemMetadata


