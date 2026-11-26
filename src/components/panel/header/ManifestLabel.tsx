import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface ManifestLabelProps extends LabelStyleProps {
  isSelecting: boolean,
  onSelect: (manifestId: string) => void,
  options: DropdownOption[]
  selectedLabel: string
  dataCy?: string
}

const ManifestLabel: FC<ManifestLabelProps> = ({ options, selectedLabel, isSelecting, onSelect, dataCy = 'manifest-label', variant = 'outline', className = '' }) => {
  const { panelState, usePanelTranslation, panelRootRef } = usePanel()
  const { t } = usePanelTranslation()
  const [showModal, setShowModal] = useState(false)


  async function handleManifestClick(id: string) {
    onSelect(id)
    setShowModal(false)
  }

  const handleOpenChange = (open: boolean) => {
    setShowModal(open)
  }

  const widthClasses = 'max-w-[120px] @max-[600px]/panel:max-w-[80px] @min-[1200px]/panel:max-w-[420px]'

  return (
    <DropdownMenu
      open={showModal}
      onOpenChange={handleOpenChange}
    >
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size="sm"
              className={`relative h-full truncate ${widthClasses} ${className} ${isSelecting ? 'text-muted-foreground animate-pulse' : ''}`}
              data-cy={dataCy}>
              <span className="truncate">{ selectedLabel }</span>
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent container={panelRootRef.current}>
          <span className="leading-none">{ isSelecting ? t('select_item_from_selected_manifest') : selectedLabel }</span>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent data-cy="manifests-dropdown" className="max-w-80" container={panelRootRef.current}>
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
