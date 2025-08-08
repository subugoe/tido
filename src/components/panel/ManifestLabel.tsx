import { FC, useEffect, useState } from 'react'
import { useDataStore } from '@/store/DataStore.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { apiRequest } from '@/utils/api.ts'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx'


interface ManifestLabelProps {
  selectedManifest: Manifest | null,
  onManifestSelect: (newManifest: Manifest | null) => void
}

const ManifestLabel: FC<ManifestLabelProps> = ({ selectedManifest, onManifestSelect }) => {
  const { panelState } = usePanel()
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
    <DropdownMenu
      open={showModal}
      onOpenChange={handleOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <div className={`text-sm text-nowrap max-w-[200px] truncate bg-accent rounded-lg font-semibold cursor-pointer hover:bg-muted px-2 py-1 ${selectedManifest ? 'text-muted-foreground animate-pulse' : ''}`}
          data-cy="manifest-label">
          {selectedLabel}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="manifests-dropdown">
        {labels.map((label, i) => <DropdownMenuItem
          key={label + '_'+i}
          className={`cursor-pointer ${panelState.manifest.label === label ? 'text-primary' : ''} `}
          title={label ?? ''}
          onClick={() => handleManifestClick(label)}
        > { label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ManifestLabel
