import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'

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
      <DropdownMenuTrigger asChild>
        <div className={`text-sm text-nowrap max-w-[120px] @min-[1200px]/panel:max-w-[300px] truncate font-semibold ${showDropdown ? 'bg-accent' : 'bg-muted'} rounded-lg cursor-pointer hover:bg-accent px-2 py-1`}
          data-cy="item-label">
          { getItemLabel() }
        </div>
      </DropdownMenuTrigger>
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
