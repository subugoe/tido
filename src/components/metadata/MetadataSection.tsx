import { FC } from 'react'

import MetadataItem from '@/components/metadata/MetadataItem.tsx'

interface MetadataSectionProps {
  title: string
  metadata: Metadata[]
}

const MetadataSection: FC<MetadataSectionProps> = ({ title, metadata }) => {
  if (metadata.length === 0) return null

  return <section>
    <h3 className="font-semibold text-base border-b border-border pb-1 mb-2">
      { title }
    </h3>
    <div className="pl-3">
      { metadata.map((meta, i) => <MetadataItem item={meta} key={i} />) }
    </div>
  </section>
}

export default MetadataSection
