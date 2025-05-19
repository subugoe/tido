import { FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'

interface ItemLabelProps {
  label: string,
  manifestLabels: string[],
  showManifestModal: boolean,
  setShowManifestModal: (show: boolean) => void,
  updateSelectedManifest: (newManifest: Manifest | null) => void,
  setShowItemModal: (show: boolean) => void,
  setIsManifestLabelSelected: (isManifestLabelSelected: boolean) => void,
}

const ManifestLabel: FC<ItemLabelProps> = ({ label, manifestLabels, showManifestModal, setShowManifestModal, updateSelectedManifest, setShowItemModal, setIsManifestLabelSelected }) => {
  const { panelState } = usePanel()
  const collection = useDataStore().collections[panelState.collectionId]?.collection

  const handleOpenChange = (open: boolean) => {
    setShowManifestModal(open)
  }


  async function handleManifestClick(label: string) {
    const manifestId = collection?.sequence.find((manifest) => manifest.label === label).id
    const manifest = await apiRequest<Manifest>(manifestId)
    updateSelectedManifest(manifest)
    setShowManifestModal(false)
    setShowItemModal(true)
    setIsManifestLabelSelected(true)
  }

  return (
    <>
      <Popover open={showManifestModal} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={showManifestModal ? 'secondary' : 'ghost'}
            className="font-semibold text-gray-600"
            onClick={() =>  setShowManifestModal(!showManifestModal)}
            data-cy="item-label">
            { label }
          </Button>
        </PopoverTrigger>
        {showManifestModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-4 max-w-[350px] w-fit max-h-[450px] h-fit pr-0 px-4 py-4">
          <div className="text-gray-600">Please select a manifest to open</div>
          <div className="text-wrap">
            <div className="flex flex-col space-y-2 max-h-[350px] overflow-y-auto">
              {manifestLabels.map((label, i) => <Button
                variant="ghost"
                key={i} className="text-wrap h-fit min-h-8 overflow-hidden"
                title={label ?? ''}
                onClick={() => handleManifestClick(label)}
              > {label }</Button>)}
            </div>
          </div>
        </PopoverContent>}
      </Popover>
    </>
  )
}

export default ManifestLabel
