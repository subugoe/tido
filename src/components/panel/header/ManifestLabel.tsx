import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface ManifestLabelProps {
  isSelecting: boolean,
  onSelect: (manifestId: string) => void,
  options: DropdownOption[]
  selectedLabel: string
}

const ManifestLabel: FC<ManifestLabelProps> = ({ options, selectedLabel, isSelecting, onSelect }) => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
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
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`relative max-w-[120px] @min-[1200px]/panel:max-w-[300px] h-full truncate ${isSelecting ? 'text-muted-foreground animate-pulse' : ''}`}
              data-cy="manifest-label">
              <span className="truncate">{ selectedLabel }</span>
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>
          <span className="leading-none">{ isSelecting ? t('select_item_from_selected_manifest') : selectedLabel }</span>
        </TooltipContent>
      </Tooltip>
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
