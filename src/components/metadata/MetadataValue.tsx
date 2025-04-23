import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import TextRenderer from '@/components/panel/TextRenderer.tsx'

interface MetadataValueProps {
  value?: string
}

const MetadataValue: FC<MetadataValueProps> = ( { value } ) => {
  const { t } = useTranslation()


  return <div className="t-ml-1 t-mb-4">
    <TextRenderer htmlString={t(value ?? '')} />
  </div>
}

export default MetadataValue


