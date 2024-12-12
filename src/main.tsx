import { createRoot } from 'react-dom/client'

import './css/preflight.css'
import './css/style.css'

import App from './App.tsx'

declare global {
  interface Window {
    Tido: (config: Config) => void
  }
}

window.Tido = function Tido(config = {} as Config) {
  createRoot(document.getElementById('app')!).render(<App customConfig={config}/>)
}


export default window.Tido
