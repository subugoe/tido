import { createRoot } from 'react-dom/client'

import './css/preflight.css'
import './css/style.css'

import App from './App.tsx'
import { getRGBColor } from '@/utils/colors.ts'

declare global {
  interface Window {
    Tido: (config: Config) => void
  }
}

window.Tido = function Tido(config = {} as Config) {
  const { theme, container } = config
  const containerEl = document.querySelector(container ?? '#app')

  if (!containerEl) {
    throw new Error('Container element not found')
  }

  const style = document.createElement('style')
  style.innerHTML = `${container || '#app'} {${getRGBColor(theme?.primaryColor ?? '#3456aa', 'primary')}}`
  document.head.appendChild(style)

  createRoot(containerEl).render(<App customConfig={config} />)
}

export default window.Tido
