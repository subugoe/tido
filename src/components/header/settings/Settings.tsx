import { FC, useEffect, useState } from 'react'
import { useConfigStore } from '@/store/ConfigStore.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import ThemeToggle from '@/components/header/settings/ThemeToggle.tsx'
import ShowSelectPanelModeToggle from '@/components/header/settings/ShowSelectPanelModeToggle.tsx'
import { CircleQuestionMark, Settings } from 'lucide-react'
import About from '@/components/header/settings/About.tsx'
import { useTranslation } from 'react-i18next'


const SettingsComp: FC = () => {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [showAboutDialog, setShowAboutDialog] = useState(false)

  const showThemeToggle = useConfigStore(state => state.config.showThemeToggle)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return

  return (
    <div className="h-fit">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Settings" className="w-fit px-2" data-cy="settings">
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2 cursor-pointer">
          {showThemeToggle && <ThemeToggle /> }
          <DropdownMenuItem asChild>
            <ShowSelectPanelModeToggle />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAboutDialog(true)}>
            <CircleQuestionMark />
            <span>{t('about_tido')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <About show={showAboutDialog} onClose={() => setShowAboutDialog(false)}></About>
    </div>
  )
}

export default SettingsComp
