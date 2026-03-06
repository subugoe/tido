import { createContext, useContext, useEffect, useState } from 'react'
import { useUIStore } from '@/store/UIStore.tsx'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  onThemeChange?: (theme: Theme) => void
}

type ThemeContextState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeContextState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeContext = createContext<ThemeContextState>(initialState)

const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'tido-theme',
  onThemeChange,
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const { theme: themeUI } = useUIStore()

  useEffect(() => {
    const root = document.querySelector('.tido')

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    if (themeUI) setTheme(themeUI)
  }, [themeUI])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
      onThemeChange?.(theme)
    },
  }

  return (
    <ThemeContext.Provider {...props} value={value} >
      {children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

export { ThemeProvider, useTheme }
