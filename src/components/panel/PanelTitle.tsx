import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'

import { useDataStore } from '@/store/DataStore.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()

  const [showModal, setShowModal] = useState(false)

  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifestsLabels = collection?.sequence.map((item) => item.label)


  const handleOpenChange = (open: boolean) => {
    setShowModal(open)
  }


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
        { panelState && panelState.item &&
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={showModal ? 'secondary' : 'ghost'}
                    className="font-semibold"
                    onClick={() => setShowModal(!showModal)}>
                    { getManifestLabel() }
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" sideOffset={8} className="w-[350px] h-[400px] overflow-y-auto pr-0 px-4 py-4">
                  <div className="flex flex-col space-y-2 text-wrap">
                    {manifestsLabels.map((label, i) => <Button variant="ghost" key={i} className="text-wrap h-fit overflow-hidden" title={label ?? ''}> {label }</Button>)}
                  </div>
                </PopoverContent>
              </Popover> }
        <span className="w-[1px] h-[80%] bg-gray-400 mx-2 grow-0 shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
        { panelState && panelState.item && <span className="text-gray-600" data-cy="item-label">{ getItemLabel() }</span>}
      </div>
    </>
  )
}

export default PanelHeader
