import { FC } from 'react'
import { ImageIcon } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'


const EmptyImage: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <div className="p-3 h-full w-full flex">
    <Empty className="bg-muted/40 border border-border border-solid" data-image-empty>
      <EmptyHeader>
        <EmptyMedia className="text-muted-foreground mb-6">
          <ImageIcon className="size-9" />
        </EmptyMedia>
        <EmptyTitle className="font-semibold">{ t('no_image_available') }</EmptyTitle>
        <EmptyDescription className="text-base">{ t('no_image_associated_with_item') }</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
}

export default EmptyImage
