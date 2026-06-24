import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx'

interface ManifestLabelProps {
  isSelecting: boolean,
  onSelect: (manifestId: string) => void,
  options: DropdownOption[]
  selectedLabel: string
}

const ManifestLabel: FC<ManifestLabelProps> = ({ options, selectedLabel, isSelecting, onSelect }) => {
  const { panelState } = usePanel()
  const [showModal, setShowModal] = useState(false)


  async function handleManifestClick(id: string) {
    onSelect(id)
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
        <div className={`text-sm text-nowrap max-w-[120px] @min-[1200px]/panel:max-w-[300px] truncate bg-muted rounded-lg font-semibold cursor-pointer hover:bg-accent px-2 py-1 ${isSelecting ? 'text-muted-foreground animate-pulse' : ''}`}
          data-cy="manifest-label">
          { selectedLabel }
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="manifests-dropdown" className="max-w-80">
        {options.map(({ id, label }, i) => <DropdownMenuItem
          key={id + '_'+i}
          className={`cursor-pointer ${panelState.manifest?.id === id ? 'text-primary' : ''} `}
          title={label ?? ''}
          onClick={() => handleManifestClick(id)}
        > { label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ManifestLabel
