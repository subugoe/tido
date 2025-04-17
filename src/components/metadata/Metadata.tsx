import { FC } from 'react'
import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'



const Metadata: FC = ({  }) => {

  return <div>
    <CollectionMetadata />
    <ItemMetadata />
  </div>
}

export default Metadata
