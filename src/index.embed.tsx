import { createRoot } from 'react-dom/client'

import '@/css/preflight.css'
import '@/css/style.css'

import { Tido as TidoApp } from './components/Tido.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'
import { TidoConfig } from '@/types'

declare global {
  interface Window {
    Tido: (config: TidoConfig) => void
  }
}

window.Tido = function Tido(config = {} as Partial<TidoConfig>) {
  const { container } = config
  const containerEl = document.querySelector(container ?? defaultConfig.container)

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  createRoot(containerEl).render(<TidoApp customConfig={config} />)
}

export default window.Tido
