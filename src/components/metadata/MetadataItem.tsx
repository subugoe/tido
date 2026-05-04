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
    {typeof item.value === 'string' && <MetadataValue value={item.value} />}
    {Array.isArray(item.value) && item.value.map((meta, i) => <MetadataItem item={meta} key={i} />)}
  </div>
}

export default MetadataItem
