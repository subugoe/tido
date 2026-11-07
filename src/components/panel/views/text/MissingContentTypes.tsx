import { FC } from 'react'
import { FileX } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'

// Shown instead of a text when the view is restricted to content types the item does not offer
const MissingContentTypes: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { missingContentTypes } = useTextView()

  const contentTypes = missingContentTypes.map(type => t(type)).join(', ')

  return <div className="p-3 pt-14 h-full w-full flex">
    <Empty className="bg-muted/40 border border-border border-solid" data-cy="missing-content-types">
      <EmptyHeader>
        <EmptyMedia className="text-muted-foreground mb-6">
          <FileX className="size-9" />
        </EmptyMedia>
        <EmptyTitle className="font-semibold">{ t('no_content_for_content_types_title') }</EmptyTitle>
        <EmptyDescription className="text-base">{ t('no_content_for_content_types', { contentTypes }) }</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
}

export default MissingContentTypes
