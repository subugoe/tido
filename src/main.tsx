import { createRoot } from 'react-dom/client'

import '@/css/preflight.css'
import '@/css/style.css'

import App from './App.tsx'
import { defaultConfig } from '@/utils/config/default-config.ts'

declare global {
  interface Window {
    Tido: (config: AppConfig) => void
  }
}

window.Tido = function Tido(config = {} as Partial<AppConfig>) {
  const { container } = config
  const containerEl = document.querySelector(container ?? defaultConfig.container)

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  createRoot(containerEl).render(<App customConfig={config} />)
}

export default window.Tido
