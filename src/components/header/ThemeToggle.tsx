import { Moon, Sun, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'

export const ThemeToggle = () => {
  const { t } = useTranslation()
  const { setTheme } = useTheme()
  const [enabledSelectViewModal, setEnabledSelectViewModal] = useState(localStorage.getItem('enabledSelectViewModal') === 'true')

  function handleSwitchClick(e) {
    e.stopPropagation()
    if (enabledSelectViewModal) {
      localStorage.setItem('enabledSelectViewModal', 'false')
      return
    }
    localStorage.setItem('enabledSelectViewModal', 'true')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 p-2">
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Settings" className="w-fit px-2">
            <Settings />
            <span>Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 h-40 p-2">
          <DropdownMenuLabel>{t('Settings')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div>{ t('toggle_theme')}</div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  { t('light') }</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                  <span>{ t('dark') }</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>{ t('system') }</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem asChild>
            <div className="flex items-center space-x-2">
              <Label htmlFor="toggle-select-view-modal">{t('enable_select_view_modal')}</Label>
              <Switch id="toggle-select-view-modal"
                checked={enabledSelectViewModal}
                onCheckedChange={setEnabledSelectViewModal}
                onClick={(e) => handleSwitchClick(e)}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
