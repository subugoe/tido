import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'

import { useDataStore } from '@/store/DataStore.tsx'
import { apiRequest } from '@/utils/api.ts'
import { usePanelStore } from '@/store/PanelStore.tsx'

const PanelHeader: FC = () => {
  const { panelState } = usePanel()

  const [showModal, setShowModal] = useState(false)

  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifestsLabels = collection?.sequence.map((item) => item.label)
  const updatePanel = usePanelStore(state => state.updatePanel)


  const handleOpenChange = (open: boolean) => {
    setShowModal(open)
  }


  function getManifestLabel() {
    return panelState?.manifest?.label ?? null
  }

  function getItemLabel() {
    return 'Page ' + (panelState?.item?.n ?? 'unknown')
  }

  async function handleManifestClick(newManifestLabel: string) {
    setShowModal(false)
    const manifestId = collection.sequence.filter((item) => item.label === newManifestLabel)[0].id
    const manifest = await apiRequest<Manifest>(manifestId)
    const item = await apiRequest<Item>(manifest.sequence[0].id)
    updatePanel(panelState.id, { manifest: manifest, item: item })
  }

  return (
    <>
      <div className="flex items-center">
        { (!panelState || !panelState.item) && <Skeleton className="w-[100px] h-6" />  }
        { panelState && panelState.item  &&
              <Popover onOpenChange={handleOpenChange} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant={showModal ? 'secondary' : 'ghost'}
                    className="font-semibold"
                    onClick={() => setShowModal(!showModal)}>
                    { getManifestLabel() }
                  </Button>
                </PopoverTrigger>
                {showModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="w-[350px] h-[400px] overflow-y-auto pr-0 px-4 py-4">
                  <div className="flex flex-col space-y-2 text-wrap">
                    {manifestsLabels.map((label, i) => <Button
                      variant="ghost"
                      key={i} className="text-wrap h-fit overflow-hidden"
                      title={label ?? ''}
                      onClick={() => handleManifestClick(label)}
                    > {label }</Button>)}
                  </div>
                </PopoverContent>}
              </Popover> }
        <span className="w-[1px] h-[80%] bg-gray-400 mx-2 grow-0 shrink-0"></span>
        { (!panelState || !panelState.item) && <Skeleton className="w-[40px] h-6" />  }
        { panelState && panelState.item && <span className="text-gray-600" data-cy="item-label">{ getItemLabel() }</span>}
      </div>
    </>
  )
}

export default PanelHeader
