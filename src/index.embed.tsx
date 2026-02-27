import { createRoot } from 'react-dom/client'

import '@/css/style.css'

import { Tido as TidoApp } from './components/Tido.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { encodeState, decodeState } from '@/utils/bookmarking.ts'
import { TidoConfig } from '@/types'

declare global {
  interface Window {
    Tido: (config: Partial<TidoConfig>) => void
  }
}

window.Tido = function Tido(this: TidoPublicApi, config = {} as Partial<TidoConfig>) {
  const { container } = config
  const containerEl = document.querySelector(container ?? defaultConfig.container)

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  createRoot(containerEl).render(<TidoApp config={config} onReady={() => this.onReady?.()} />)
}

window.Tido.encodeState = encodeState
window.Tido.decodeState = decodeState
export default window.Tido
