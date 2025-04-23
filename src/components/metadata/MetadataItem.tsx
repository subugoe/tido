import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import MetadataValue from '@/components/metadata/MetadataValue.tsx'

interface MetadataItemProps {
  item: Metadata
}

const MetadataItem: FC<MetadataItemProps> = ({ item }) => {
  const { t } = useTranslation()

  return <div>
    <h4 className="t-font-semibold t-text-sm t-text-gray-400">
      {t(item.key)}
    </h4>
    <MetadataValue value={item.value} />
    <div className="nested-metadata t-ml-2">
      {
        item?.metadata?.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>
  </div>
}

export default MetadataItem
