import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Ellipsis, Trash2 } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import PanelModeMenu from '@/components/panel/PanelModeMenu.tsx'


const Options: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { remove } = usePanel()

  function removePanel() {
    remove()
  }

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" data-cy="options-button">
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent data-cy="options-content" align="end" className="w-48">
      <DropdownMenuLabel>{ t('options') }</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <PanelModeMenu />
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={removePanel} className="text-destructive focus:text-destructive focus:bg-destructive/3">
        <Trash2 className="mr-2 text-destructive" /> { t('remove_panel') }
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default Options
