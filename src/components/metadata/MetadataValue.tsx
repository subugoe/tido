import { FC } from 'react'

import TextRenderer from '@/components/panel/TextRenderer.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface MetadataValueProps {
  value?: string
}

const MetadataValue: FC<MetadataValueProps> = ( { value } ) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()


  return <div className="ml-1 mb-4">
    <TextRenderer htmlString={t(value ?? '')} />
  </div>
}

export default MetadataValue

