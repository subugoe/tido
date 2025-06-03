import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import ItemLabel from '@/components/panel/ItemLabel.tsx'
import ManifestLabel from '@/components/panel/ManifestLabel.tsx'
import { CircleAlert } from 'lucide-react'

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
            <ManifestLabel onManifestSelect={onManifestSelect}  selectedManifest={selectedManifest} />
            { selectedManifest && <CircleAlert className="absolute w-5 h-5 rounded-full top-0 -mt-1 right-1 text-white bg-yellow-600 stroke-2" />}
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
