import { FC, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/ManifestLabel.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()
  const [showItemModal, setShowItemModal] = useState(false)
  const selectedManifest = useRef(null)

  function onManifestSelect(newManifest: Manifest | null) {
    updateSelectedManifest(newManifest)
    if (newManifest) setShowItemModal(true)
  }

  function onItemSelect() {
    updateSelectedManifest(null)
  }

  function updateSelectedManifest(newManifest: Manifest | null) {
    selectedManifest.current = newManifest
  }


  return (
    <>
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item  && <ManifestLabel onManifestSelect={onManifestSelect}  selectedManifest={selectedManifest.current} />}
        <span className="w-[1px] h-[80%] bg-gray-400 mx-2 grow-0 shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
        { panelState && panelState.item && <ItemLabel selectedManifest={selectedManifest.current} onItemSelect={onItemSelect}  showItemModal={showItemModal} setShowItemModal={setShowItemModal} />}
      </div>
    </>
  )
}

export default PanelHeader
