import { createRoot } from 'react-dom/client'

import '@/css/style.css'

import { Tido as TidoApp } from './components/Tido.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { encodeState, decodeState } from '@/utils/bookmarking.ts'
import { TidoConfig } from '@/types'

declare global {
  interface Window {
    Tido: (config: TidoConfig) => void
  }
}

window.Tido = function Tido(config = {} as Partial<TidoConfig>) {
  const { container } = config
  const containerEl = document.querySelector(container ?? defaultConfig.container)
  // const encodeState = encodeState
  // const decodeState = decodeState

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  createRoot(containerEl).render(<TidoApp config={config} />)
}

window.Tido.encodeState = encodeState
window.Tido.decodeState = decodeState
export default window.Tido
