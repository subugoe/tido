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
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item && <span className="font-semibold">{ getManifestLabel() }</span>}
        <span className="w-[1px] h-[80%] bg-muted mx-2 grow-0 shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
        { panelState && panelState.item && <span className="text-muted-foreground" data-cy="item-label">{ getItemLabel() }</span>}
      </div>
    </>
  )
}

export default PanelHeader
