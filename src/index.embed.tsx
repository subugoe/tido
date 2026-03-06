import { createRoot } from 'react-dom/client'

import '@/css/style.css'

import { Tido as TidoApp } from './components/Tido.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { encodeState, decodeState } from '@/utils/bookmarking.ts'
import { TidoConfig, TidoInstance, ThemeConfig } from '@/types'
import { useUIStore } from '@/store/UIStore.tsx'


declare global {
  interface Window {
    Tido: (config: Partial<TidoConfig>) => void
  }
}

window.Tido = function Tido(this: TidoInstance, config = {} as Partial<TidoConfig>) {
  const { container } = config
  const containerEl = document.querySelector(container ?? defaultConfig.container)
  const { updateTheme } = useUIStore.getState()

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  this.setTheme = (newTheme) => {
    updateTheme(newTheme)
  }


  const handleReady = () => this.onReady?.()
  const handleThemeChange = (theme: ThemeConfig['theme']) => this.onThemeChange?.(theme)

  createRoot(containerEl).render(
    <TidoApp
      config={config}
      onReady={handleReady}
      onThemeChange={handleThemeChange}
    />
  )
}

window.Tido.encodeState = encodeState
window.Tido.decodeState = decodeState
export default window.Tido
