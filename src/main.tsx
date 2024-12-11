import { createRoot } from 'react-dom/client'
import { ConfigProvider} from '@/contexts/ConfigContext'

import './css/preflight.css'
import './css/style.css'

import App from './App.tsx'

window.Tido = function Tido(config = {}) {
    createRoot(document.getElementById('app')!).render(<ConfigProvider><App customConfig={config} /></ConfigProvider>)
}


export default window.Tido
