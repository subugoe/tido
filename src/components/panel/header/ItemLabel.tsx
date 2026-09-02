import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'

interface ItemLabelProps {
  onSelect?: (itemId: string) => void
  onDropdownClose?: () => void
  showDropdown?: boolean,
  setShowDropdown?: (value: boolean) => void
  options: DropdownOption[]
}

const ItemLabel: FC<ItemLabelProps> = ({ options, showDropdown = false, setShowDropdown, onSelect, onDropdownClose }) => {
  const { panelState, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const handleOpenChange = (open: boolean) => {
    setShowDropdown(open)
    if (!open) {
      onDropdownClose()
    }
  }

  async function handleItemClick(itemId: string) {
    onSelect(itemId)
  }

  function getItemLabel() {
    return t(panelState?.item?.division ?? 'unknown')
  }

  return (
    <DropdownMenu
      open={showDropdown}
      onOpenChange={handleOpenChange}
    >
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`max-w-[120px] @min-[1200px]/panel:max-w-[300px] truncate ${showDropdown ? 'bg-muted' : ''}`}
              data-cy="item-label">
              <span className="truncate">{ getItemLabel() }</span>
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>
          <span className="leading-none">{ getItemLabel() }</span>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent data-cy="items-dropdown" className="max-w-80">
        {options.map(({ id, label }, i) => <DropdownMenuItem
          key={id + '_'+i}
          className={`cursor-pointer ${panelState.item?.id === id ? 'data-[highlighted]:text-primary text-primary' : ''} `}
          title={label ?? ''}
          onClick={() => handleItemClick(id)}
        > { label }
        </DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ItemLabel
