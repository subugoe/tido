import { FC } from 'react'
import MetadataValue from '@/components/metadata/MetadataValue.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface MetadataItemProps {
  item: Metadata
}

const MetadataItem: FC<MetadataItemProps> = ({ item }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <div>
    <h4 className="font-semibold text-sm text-muted-foreground">
      {t(item.key)}
    </h4>
    <MetadataValue value={item.value} />
    <div className="ml-2">{item?.metadata?.map((meta, i) => <MetadataItem item={meta} key={i} />)} </div>
  </div>
}

export default MetadataItem
