import { FC, useEffect, useState } from 'react'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import ThemeToggle from '@/components/header/ThemeToggle.tsx'
import ShowSelectPanelModeToggle from '@/components/header/ShowSelectPanelModeToggle.tsx'
import { Settings } from 'lucide-react'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'


const SettingsComp: FC = () => {
  const [mounted, setMounted] = useState(false)
  const showThemeToggle = useConfigStore(state => state.config.showThemeToggle)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return

  return (
    <div className="h-fit">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Settings" className="w-fit px-2">
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2 cursor-pointer">
          {showThemeToggle && <ThemeToggle /> }
          <DropdownMenuItem asChild>
            <ShowSelectPanelModeToggle />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SettingsComp
