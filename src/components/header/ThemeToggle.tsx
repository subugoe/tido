import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'


import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Moon, Sun } from 'lucide-react'


const ThemeToggle: FC = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <>
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
    </>
  )
}

export default ThemeToggle
