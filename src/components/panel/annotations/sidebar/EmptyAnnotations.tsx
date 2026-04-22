import { FC } from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { TableOfContents } from 'lucide-react'


const EmptyAnnotations: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  return <Empty className="mt-16">
    <EmptyHeader>
      <EmptyMedia variant="icon" className="bg-background text-muted-foreground">
        <TableOfContents />
      </EmptyMedia>
      <EmptyTitle>{ t('no_annotations_found') }</EmptyTitle>
      <EmptyDescription>{ t('no_annotations_exist_for_current_text') }</EmptyDescription>
    </EmptyHeader>
  </Empty>
}

export default EmptyAnnotations
