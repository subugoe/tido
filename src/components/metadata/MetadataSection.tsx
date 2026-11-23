import { FC } from 'react'

import { MetadataList } from '@/components/metadata/MetadataItem.tsx'
import MetadataValue from '@/components/metadata/MetadataValue.tsx'
import { splitMetadataHeading } from '@/utils/metadata.ts'

interface MetadataSectionProps {
  title: string
  metadata: Metadata[]
}

// Metadata of one level (collection, manifest or item): its title as heading,
// the remaining fields as a list aligned with the other sections.
const MetadataSection: FC<MetadataSectionProps> = ({ title, metadata }) => {
  if (metadata.length === 0) return null

  const { heading, fields } = splitMetadataHeading(metadata)

  return <section className="col-span-2 grid grid-cols-subgrid border-t border-border pt-4 first:border-t-0 first:pt-0">
    <p className="col-span-2 text-xs leading-4 text-muted-foreground">{title}</p>
    {heading && <h3 className="col-span-2 mt-0.5 text-[0.9375rem] font-semibold leading-snug break-words">
      <MetadataValue value={heading} />
    </h3>}
    {fields.length > 0 && <MetadataList items={fields} className="mt-2.5" subgrid />}
  </section>
}

export default MetadataSection
