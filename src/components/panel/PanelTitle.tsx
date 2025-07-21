import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/ManifestLabel.tsx'
import TitleAlertIcon from '@/components/panel/TitleAlertIcon.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()
  const [selectedManifest, setSelectedManifest] = useState(null)

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
          <div className="relative">
            <ManifestLabel onManifestSelect={onManifestSelect} selectedManifest={selectedManifest}  />
            { selectedManifest && <TitleAlertIcon />}
          </div>}
        <span className="w-[1px] h-[80%] grow-0 shrink-0  bg-gray-400 mx-2"></span>
        <div>
          { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
          { panelState && panelState.item && <ItemLabel selectedManifest={selectedManifest} onItemSelect={onItemSelect} />}
        </div>
      </div>
    </>
  )
}

export default PanelHeader
