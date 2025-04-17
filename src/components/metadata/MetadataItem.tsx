import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface MetadataItemProps {
  item: Metadata
}

const MetadataItem: FC<MetadataItemProps> = ({ item }) => {
  const { t } = useTranslation()

  return <div>
    <div>
      <h4 className="t-font-semibold t-text-sm t-text-gray-400">
        {t(item.key)}
      </h4>
      <p className={'t-ml-1 t-mb-4'}> {t(item?.value ?? 'value_missing')}</p>
    </div>
    <div className="nested-metadata">
      {
        item?.metadata?.map((meta, i) => <MetadataItem item={meta} key={i} />)
      }
    </div>
  </div>
}

export default MetadataItem
