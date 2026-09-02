import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { CircleQuestionMark, Moon, MonitorCog, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import About from '@/components/rail/About.tsx'

const THEMES: { value: 'light' | 'dark' | 'system'; icon: React.ReactNode }[] = [
  { value: 'light', icon: <Sun className="h-[1.2rem] w-[1.2rem]" /> },
  { value: 'dark', icon: <Moon className="h-[1.2rem] w-[1.2rem]" /> },
  { value: 'system', icon: <MonitorCog className="h-[1.2rem] w-[1.2rem]" /> }
]

const SettingsContent: FC = () => {
  const { t } = useTranslation()
  const { showThemeToggle } = useConfig()
  const { theme, setTheme } = useTheme()
  const [showAboutDialog, setShowAboutDialog] = useState(false)

  return (
    <div className="flex flex-col h-full gap-4" data-cy="settings-content">
      {showThemeToggle && (
        <>
          <p className="text-sm font-medium mb-2 px-3">{t('toggle_theme')}</p>
          <div className="flex flex-col gap-1">
            {THEMES.map(({ value, icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                  theme === value
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                )}
                data-cy={`theme-${value}`}
              >
                {icon}
                <span>{t(value)}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <div className="mt-auto"></div>
      <button
        onClick={() => setShowAboutDialog(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
        data-cy="settings-about"
      >
        <CircleQuestionMark className="h-[1.2rem] w-[1.2rem]" />
        <span>{t('about_tido')}</span>
      </button>

      <About show={showAboutDialog} onClose={() => setShowAboutDialog(false)} />
    </div>
  )
}

export default SettingsContent
