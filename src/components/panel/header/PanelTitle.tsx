import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/header/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/header/ManifestLabel.tsx'
import TitleAlertIcon from '@/components/panel/header/TitleAlertIcon.tsx'
import PrevItemButton from '@/components/panel/navigation/PrevItemButton.tsx'
import NextItemButton from '@/components/panel/navigation/NextItemButton.tsx'
import PrevManifestButton from '@/components/panel/navigation/PrevManifestButton.tsx'
import NextManifestButton from '@/components/panel/navigation/NextManifestButton.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { apiRequest } from '@/utils/api.ts'

const PanelTitle: FC = () => {
  const { panelState, usePanelTranslation, init } = usePanel()
  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null)
  const [showItemDropdown, setShowItemDropdown] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)

  const { t } = usePanelTranslation()

  async function onManifestSelect(manifestId: string) {
    const manifest = await apiRequest<Manifest>(manifestId)
    setSelectedManifest(manifest)
    setShowItemDropdown(true)
  }

  async function onItemSelect(itemId: string) {
    setIsSelecting(false)
    setSelectedManifest(null)

    const targetManifest = selectedManifest || panelState.manifest
    if (!targetManifest) return

    const item = await apiRequest<Item>(itemId)

    if (!item) return

    setShowItemDropdown(false)
    await init({ ...panelState.config, manifest: targetManifest.id, item: item.id })
  }

  function onItemDropdownClose(closeWithoutSelect: boolean) {
    setIsSelecting(false)
    if (closeWithoutSelect) setSelectedManifest(null)
  }

  return (
    <>
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item  &&
          <div className="flex gap-1">
            <BaseTooltip message={t('previous_manifest')}>
              <PrevManifestButton />
            </BaseTooltip>
            <div className="relative">
              <ManifestLabel onSelect={onManifestSelect} isSelecting={isSelecting} />
              {/*{isSelecting && <TitleAlertIcon />}*/}
            </div>
            <BaseTooltip message={t('next_manifest')}>
              <NextManifestButton />
            </BaseTooltip>
          </div>
        }
        <span className="w-[1px] h-[80%] grow-0 shrink-0  bg-gray-400 mx-2"></span>
        <div>
          {(!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />}
          { panelState && panelState.item &&
            <div className="flex items-center gap-1">
              <BaseTooltip message={t('previous_item')}>
                <PrevItemButton />
              </BaseTooltip>
              <ItemLabel
                onSelect={onItemSelect}
                onDropdownClose={onItemDropdownClose}
                showDropdown={showItemDropdown}
                setShowDropdown={setShowItemDropdown}
              />
              <BaseTooltip message={t('next_item')}>
                <NextItemButton />
              </BaseTooltip>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default PanelTitle
