import { FC, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useDataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'
import { useConfigStore } from '@/store/ConfigStore.tsx'

interface ItemLabelProps {
  selectedManifest: Manifest | null,
  updateSelectedManifest: (newManifest: Manifest | null) => void,
  showManifestModal: boolean,
  setShowManifestModal: (show: boolean) => void,
  setShowItemModal: (show: boolean) => void,
}

const ManifestLabel: FC<ItemLabelProps> = ({ selectedManifest, updateSelectedManifest, showManifestModal, setShowManifestModal, setShowItemModal }) => {
  const { panelState } = usePanel()
  const primaryColor = useConfigStore().config.theme.primaryColor
  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifest = panelState.manifest
  const labels = collection?.sequence.map((item) => item.label)
  const [selectedLabel, setSelectedLabel] = useState('')

  useEffect(() => {
    function getManifestLabel() {
      const label = selectedManifest ? selectedManifest.label : panelState?.manifest?.label ?? null
      setSelectedLabel(label)
    }

    getManifestLabel()
  }, [selectedManifest, manifest])

  async function handleManifestClick(label: string) {
    const manifestId = collection?.sequence.find((manifest) => manifest.label === label).id
    const manifest = await apiRequest<Manifest>(manifestId)
    updateSelectedManifest(manifest)
    setShowManifestModal(false)
    setShowItemModal(true)
  }

  const handleOpenChange = (open: boolean) => {
    setShowManifestModal(open)
  }



  return (
    <>
      <Popover open={showManifestModal} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={showManifestModal ? 'secondary' : 'ghost'}
            className="relative font-semibold text-gray-600"
            onClick={() =>  setShowManifestModal(!showManifestModal)}
            data-cy="manifest-label">
            { selectedLabel }
            { selectedManifest && <div
              className="absolute mb-4 right-1 flex items-center justify-center w-4 h-4 border-[1px] border-gray-400 text-yellow-300 text-md font-bold rounded-full">
                !
            </div> }
          </Button>
        </PopoverTrigger>
        {showManifestModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-2 max-w-[350px] w-fit max-h-[450px] pr-0 h-fit pl-2 py-2">
          <div className="text-gray-600 ml-1">Please select a manifest to open</div>
          <div className="text-wrap">
            <div className="flex flex-col space-y-1 max-h-[350px] overflow-y-auto">
              {labels.map((label, i) => <Button
                variant="ghost"
                key={i}
                style={{ color: label === selectedLabel ? primaryColor : '' }}
                className={`h-fit min-h-8 justify-start overflow-hidden pl-2 mr-2`}
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
