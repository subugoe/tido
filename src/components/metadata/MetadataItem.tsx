import { FC } from 'react'
import MetadataValue from '@/components/metadata/MetadataValue.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface MetadataItemProps {
  item: Metadata
}

// One row of a metadata definition list. Nested metadata gets its own
// indented list below the label, spanning both columns.
const MetadataItem: FC<MetadataItemProps> = ({ item }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  if (Array.isArray(item.value)) {
    return <div className="col-span-2">
      <dt className="text-muted-foreground">{t(item.key)}</dt>
      <dd className="mt-1.5">
        <MetadataList items={item.value} className="pl-3 border-l border-border" />
      </dd>
    </div>
  }

  return <div className="contents">
    <dt className="text-muted-foreground break-words">{t(item.key)}</dt>
    <dd className="min-w-0 break-words [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-muted-foreground [&_a:hover]:decoration-foreground">
      <MetadataValue value={item.value} />
    </dd>
  </div>
}

interface MetadataListProps {
  items: Metadata[]
  className?: string
  // Align label and value columns with the surrounding grid
  subgrid?: boolean
}

export const MetadataList: FC<MetadataListProps> = ({ items, className = '', subgrid = false }) => (
  <dl className={`grid gap-y-1.5 text-sm leading-snug ${
    subgrid ? 'col-span-2 grid-cols-subgrid' : 'grid-cols-[fit-content(10rem)_minmax(0,1fr)] gap-x-4'
  } ${className}`}>
    {items.map((meta, i) => <MetadataItem item={meta} key={i} />)}
  </dl>
)

export default MetadataItem
