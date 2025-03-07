import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()

  function getManifestLabel() {
    return panelState?.manifest?.label ?? null
  }

  function getItemLabel() {
    return 'Page ' + (panelState?.item?.n ?? 'unknown')
  }

  return (
    <>
      <div className="t-flex t-items-center">
        { (!panelState || !panelState.item) && <Skeleton className="t-w-[100px] t-h-6" />  }
        { panelState && panelState.item && <span className="t-font-semibold">{ getManifestLabel() }</span>}
        <span className="t-w-[1px] t-h-[80%] t-bg-gray-400 t-mx-2 t-grow-0 t-shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="t-w-[40px] t-h-6" />  }
        { panelState && panelState.item && <span className="t-text-gray-600">{ getItemLabel() }</span>}
      </div>
    </>
  )
}

export default PanelHeader
