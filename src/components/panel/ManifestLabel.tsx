import { FC, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTranslation } from 'react-i18next'

import { useDataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'


interface ManifestLabelProps {
  selectedManifest: Manifest | null,
  onManifestSelect: (newManifest: Manifest | null) => void
}

const ManifestLabel: FC<ManifestLabelProps> = ({ selectedManifest, onManifestSelect }) => {
  const { panelState } = usePanel()
  const { t } = useTranslation()
  const collection = useDataStore().collections[panelState.collectionId]?.collection
  const manifest = panelState.manifest
  const labels = collection?.sequence.map((item) => item.label)
  const [showModal, setShowModal] = useState(false)
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
    onManifestSelect(manifest)
    setShowModal(false)
  }

  const handleOpenChange = (open: boolean) => {
    setShowModal(open)
  }


  return (
    <>
      <Popover open={showModal} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={showModal ? 'secondary' : 'ghost'}
            onClick={() =>  setShowModal(!showModal)}
            title={selectedLabel}
            data-cy="manifest-label"
            className="px-2 py-1 h-7 w-40"
          >
            <div className="text-sm rounded-md font-semibold truncate">
              {selectedLabel}
            </div>
          </Button>
        </PopoverTrigger>
        {showModal && <PopoverContent side="bottom" align="start" sideOffset={8} className="flex flex-col space-y-2 max-w-[350px] w-fit max-h-[450px] pr-0 h-fit pl-0 py-4">
          <div className="text-muted-foreground ml-1 px-2 mb-0">{ t('please_select_a_manifest_to_open') }</div>
          <div className="flex flex-col space-y-1 max-h-[350px] overflow-y-auto pb-1 pt-1 pl-2">
            {labels.map((label, i) => <Button
              variant="ghost"
              key={label + '_'+i}
              className={`h-8 justify-start overflow-hidden mr-2 pl-2 pr-1 py-1 ${panelState.manifest.label === label ? 'text-primary hover:text-primary': ''} `}
              title={label ?? ''}
              onClick={() => handleManifestClick(label)}
            > {label }</Button>)}
          </div>
        </PopoverContent>}
      </Popover>
    </>
  )
}

export default ManifestLabel
