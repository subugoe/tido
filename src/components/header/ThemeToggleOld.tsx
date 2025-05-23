import { Moon, Sun, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'

export const ThemeToggle = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [enabledSelectViewModal, setEnabledSelectViewModal]  = useState(useUIStore.getState().enabledSelectViewPopover)
  const updateEnabledSelectViewModal = useUIStore.getState().updateEnabledSelectViewPopover
  const allowSelectViewModal = useUIStore(state => state.enabledSelectViewPopover)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setEnabledSelectViewModal(allowSelectViewModal)
  }, [allowSelectViewModal])

  function handleSwitchClick(e) {
    e.stopPropagation()
    if (enabledSelectViewModal) {
      setEnabledSelectViewModal(false)
      updateEnabledSelectViewModal(false)
      return
    }
    setEnabledSelectViewModal(true)
    updateEnabledSelectViewModal(true)
  }

  if (!mounted) return null


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Settings" className="w-fit px-2">
            <Settings />
            <span>Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 h-40 p-2">
          <DropdownMenuLabel>{t('Settings')}</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div>{ t('toggle_theme')}</div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled={theme=== 'light'} onClick={() => setTheme('light')}>
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                  { t('light') }</DropdownMenuItem>
                <DropdownMenuItem disabled={theme=== 'dark'} onClick={() => setTheme('dark')}>
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                  <span>{ t('dark') }</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  disabled={theme=== 'system'}
                >
                  { t('system') }
                </DropdownMenuItem>
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
