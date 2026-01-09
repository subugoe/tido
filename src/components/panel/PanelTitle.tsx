import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/ManifestLabel.tsx'
import TitleAlertIcon from '@/components/panel/TitleAlertIcon.tsx'
import PrevItemButton from '@/components/panel/navigation/PrevItemButton.tsx'
import NextItemButton from '@/components/panel/navigation/NextItemButton.tsx'
import PrevManifestButton from '@/components/panel/navigation/PrevManifestButton.tsx'
import NextManifestButton from '@/components/panel/navigation/NextManifestButton.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'

const PanelHeader: FC = () => {
  const { panelState, usePanelTranslation } = usePanel()
  const [selectedManifest, setSelectedManifest] = useState(null)

  const { t } = usePanelTranslation()

  function onManifestSelect(newManifest: Manifest | null) {
    updateSelectedManifest(newManifest)
  }

  function onItemSelect() {
    updateSelectedManifest(null)
  }

  function updateSelectedManifest(newManifest: Manifest | null) {
    setSelectedManifest(newManifest)
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
              <ManifestLabel onManifestSelect={onManifestSelect} selectedManifest={selectedManifest} />
              {selectedManifest && <TitleAlertIcon />}
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
              <ItemLabel selectedManifest={selectedManifest} onItemSelect={onItemSelect} />
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

export default PanelHeader
