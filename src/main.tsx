import { createRoot } from 'react-dom/client'

import './css/preflight.css'
import './css/style.css'

import App from './App.tsx'

window.Tido = function Tido(config = {}) {
    createRoot(document.getElementById('app')!).render(<App customConfig={config} />)
}


export default window.Tido
