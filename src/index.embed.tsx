import { createRoot } from 'react-dom/client'

import '@/css/style.css'

import { Tido as TidoApp } from './components/Tido.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { encodeState, decodeState } from '@/utils/bookmarking.ts'
import { TidoConfig, TidoInstance } from '@/types'


declare global {
  interface Window {
    Tido: (config: Partial<TidoConfig>) => void
  }
}

window.Tido = function Tido(this: TidoInstance, config = {} as Partial<TidoConfig>) {
  const { container } = config
  const containerEl = document.querySelector(container ?? defaultConfig.container)

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  /*
  this.setTheme = (newTheme) => {
    setTheme(newTheme)
  }
  */

  createRoot(containerEl).render(<TidoApp config={config} onReady={() => this.onReady?.()} onThemeChange={(theme) => this.onThemeChange?.(theme)} /> )
}

window.Tido.encodeState = encodeState
window.Tido.decodeState = decodeState
export default window.Tido
