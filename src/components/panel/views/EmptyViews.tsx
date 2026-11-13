import { FC } from 'react'
import { PanelsTopLeft } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

// A panel whose views all have nothing to show on the current item (see hideEmptyViews)
const EmptyViews: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return <div className="p-3 h-full w-full flex">
    <Empty className="bg-muted/40 border border-border border-solid" data-cy="panel-views-empty">
      <EmptyHeader>
        <EmptyMedia className="text-muted-foreground mb-6">
          <PanelsTopLeft className="size-9" />
        </EmptyMedia>
        <EmptyTitle className="font-semibold">{ t('no_views_to_show_title') }</EmptyTitle>
        <EmptyDescription className="text-base">{ t('no_views_to_show') }</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
}

export default EmptyViews
