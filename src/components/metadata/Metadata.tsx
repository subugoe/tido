import { FC } from 'react'
import { X } from 'lucide-react'

import CollectionMetadata from '@/components/metadata/CollectionMetadata.tsx'
import ItemMetadata from '@/components/metadata/ItemMetadata.tsx'
import ManifestMetadata from '@/components/metadata/ManifestMetadata.tsx'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface MetadataProps {
  onClose: () => void
}

const Metadata: FC<MetadataProps> = ({ onClose }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <div className="flex flex-col">
    <div className="flex items-center justify-between gap-2 pl-4 pr-2 py-2 border-b border-border">
      <h2 className="text-base font-semibold">{t('metadata')}</h2>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={onClose}
        aria-label="Close"
        data-cy="metadata-close"
      >
        <X size={15} />
      </Button>
    </div>
    <div
      className="grid grid-cols-[fit-content(10rem)_minmax(0,1fr)] gap-x-4 gap-y-4 px-4 pt-4 pb-5 max-h-[min(60vh,500px)] overflow-y-auto"
      data-cy="metadata-content"
    >
      <CollectionMetadata />
      <ManifestMetadata />
      <ItemMetadata />
    </div>
  </div>
}

export default Metadata
