import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext.tsx'

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Moon, Sun, MonitorCog } from 'lucide-react'


const ThemeToggle: FC = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          { t('toggle_theme') }
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="border border-border flex flex-col gap-y-1">
            <DropdownMenuItem className={`${theme==='light' ? 'bg-muted' : ''}`} onClick={() => setTheme('light')}>
              <Sun className="h-[1.2rem] w-[1.2rem]" />
              { t('light') }</DropdownMenuItem>
            <DropdownMenuItem className={`${theme==='dark' ? 'bg-muted' : ''}`} onClick={() => setTheme('dark')}>
              <Moon className="h-[1.2rem] w-[1.2rem]" />
              <span>{ t('dark') }</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${theme==='system' ? 'bg-muted' : ''}`}
              onClick={() => setTheme('system')}
            >
              <MonitorCog className="h-[1.2rem] w-[1.2rem]" />
              { t('system') }
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  )
}

export default ThemeToggle
