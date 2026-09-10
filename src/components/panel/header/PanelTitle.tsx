import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import type { ManifestSwitcher } from '@/components/panel/header/useManifestSwitcher.ts'

import ItemLabel from '@/components/panel/header/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/header/ManifestLabel.tsx'
import PrevItemButton from '@/components/panel/navigation/PrevItemButton.tsx'
import NextItemButton from '@/components/panel/navigation/NextItemButton.tsx'
import PrevManifestButton from '@/components/panel/navigation/PrevManifestButton.tsx'
import NextManifestButton from '@/components/panel/navigation/NextManifestButton.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { ButtonGroup } from '@/components/ui/button-group.tsx'

interface PanelTitleProps {
  switcher: ManifestSwitcher
}

const PanelTitle: FC<PanelTitleProps> = ({ switcher }) => {
  const { panelState } = usePanel()
  const collection = useDataStore(s => s.collections[panelState.collectionId])
  const hasManifest = !!panelState?.manifest
  const noManifest = !hasManifest

  return (
    <div className="flex items-center gap-1 min-w-0">
      {noManifest && !collection && (
        <Skeleton className="w-[100px] h-6" />
      )}
      {hasManifest && (
        <div className="hidden @min-[600px]/panel:flex items-center shrink-0">
          <ButtonGroup className="h-7">
            <PrevManifestButton />
            <ManifestLabel
              options={switcher.manifestOptions}
              selectedLabel={switcher.selectedLabel}
              onSelect={switcher.onManifestSelect}
              isSelecting={switcher.isSelecting}
              merged={switcher.isSingleItem}
            />
            <NextManifestButton />
          </ButtonGroup>
        </div>
      )}
      {noManifest && collection && (
        <Skeleton className="w-[60px] h-6" />
      )}
      {hasManifest && !switcher.isSingleItem && (
        <ButtonGroup className="h-7 shrink-0">
          <PrevItemButton />
          <ItemLabel
            options={switcher.itemOptions}
            onSelect={switcher.onItemSelect}
            onDropdownClose={switcher.onItemDropdownClose}
            showDropdown={switcher.showItemDropdown}
            setShowDropdown={switcher.setShowItemDropdown}
          />
          <NextItemButton />
        </ButtonGroup>
      )}
    </div>
  )
}

export default PanelTitle