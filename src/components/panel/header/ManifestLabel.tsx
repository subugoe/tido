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
  const collection = useDataStore().collections[panelState.collectionId]
  const manifest = panelState.manifest
  const [showModal, setShowModal] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')
  const [manifestOptions, setManifestOptions] = useState<{id: string, label: string}[]>([])

  useEffect(() => {
    async function loadManifestOptions() {
      if (!collection?.manifests) return
      const manifests = await Promise.all(
        collection.manifests.map(async (id) => {
          const m = await apiRequest<Manifest>(id)
          return { id: m.id, label: m.label }
        })
      )
      setManifestOptions(manifests)
    }
    loadManifestOptions()
  }, [collection])

  useEffect(() => {
    function getManifestLabel() {
      const label = selectedManifest ? selectedManifest.label : panelState?.manifest?.label ?? null
      setSelectedLabel(label)
    }

    getManifestLabel()
  }, [selectedManifest, manifest])

  async function handleManifestClick(label: string) {
    const manifestId = manifestOptions.find((m) => m.label === label)?.id
    if (!manifestId) return
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
        <div className={`text-sm text-nowrap max-w-[120px] @min-[1200px]/panel:max-w-[300px] truncate bg-muted rounded-lg font-semibold cursor-pointer hover:bg-accent px-2 py-1 ${selectedManifest ? 'text-muted-foreground animate-pulse' : ''}`}
          data-cy="manifest-label">
          {selectedLabel}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="manifests-dropdown" className="max-w-80">
        {manifestOptions.map((m, i) => <DropdownMenuItem
          key={m.id + '_'+i}
          className={`cursor-pointer ${panelState.manifest?.id === m.id ? 'text-primary' : ''} `}
          title={m.label ?? ''}
          onClick={() => handleManifestClick(m.label)}
        > { m.label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ManifestLabel
