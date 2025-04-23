import { FC } from 'react'

import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface MetadataValueProps {
  value?: string
}

const MetadataValue: FC<MetadataValueProps> = ( { value } ) => {


  return <div className="t-ml-1 t-mb-4">
    <TextRenderer htmlString={value ?? ''} />
  </div>
}

export default MetadataValue


