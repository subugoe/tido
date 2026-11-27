import { FC } from 'react'
import { FolderTree } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import type { ManifestSwitcher } from '@/components/panel/header/useManifestSwitcher.ts'
import CollectionTreePopover from '@/components/panel/header/CollectionTreePopover.tsx'
import ManifestLabel from '@/components/panel/header/ManifestLabel.tsx'
import ItemLabel from '@/components/panel/header/ItemLabel.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx'

interface Props {
  switcher: ManifestSwitcher
}

const segmentClasses = 'shrink min-w-0 max-w-full h-7 px-1.5 font-normal text-muted-foreground hover:text-foreground hover:bg-muted'

const PanelBreadcrumb: FC<Props> = ({ switcher }) => {
  const { panelState } = usePanel()
  const { showCollectionTitle } = useConfig()
  const collection = useDataStore(s => panelState?.collectionId ? s.collections[panelState.collectionId] : null)

  if (!panelState.manifest) return <Skeleton className="w-[200px] h-6" />

  const lastClasses = 'font-semibold text-foreground dark:text-foreground'

  return (
    <Breadcrumb className="min-w-0" data-cy="panel-breadcrumb">
      <BreadcrumbList className="flex-nowrap gap-0.5 sm:gap-0.5 min-w-0">
        {showCollectionTitle && collection && <>
          <BreadcrumbItem className="min-w-7 @min-[700px]/panel:min-w-16 shrink max-w-[200px]">
            <CollectionTreePopover collectionId={panelState.collectionId} trigger={
              <Button
                variant="ghost"
                size="sm"
                className={segmentClasses}
                title={collection.titles[0]}
                data-cy="collection-title"
              >
                <FolderTree size={16} />
                {/* in narrow panels only the icon - the title is in the tooltip then */}
                <span className="truncate hidden @min-[700px]/panel:inline">{ collection.titles[0] }</span>
              </Button>
            } />
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
        </>}
        <BreadcrumbItem className="min-w-16 shrink max-w-[240px]">
          <ManifestLabel
            variant="ghost"
            className={`${segmentClasses} ${switcher.isSingleItem ? lastClasses : ''}`}
            options={switcher.manifestOptions}
            selectedLabel={switcher.manifestLabel}
            onSelect={switcher.onManifestSelect}
            isSelecting={switcher.isSelecting}
          />
        </BreadcrumbItem>
        {!switcher.isSingleItem && <>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem className="min-w-16 shrink max-w-[200px]">
            <ItemLabel
              variant="ghost"
              className={`${segmentClasses} ${lastClasses}`}
              options={switcher.itemOptions}
              onSelect={switcher.onItemSelect}
              onDropdownClose={switcher.onItemDropdownClose}
              showDropdown={switcher.showItemDropdown}
              setShowDropdown={switcher.setShowItemDropdown}
            />
          </BreadcrumbItem>
        </>}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default PanelBreadcrumb
