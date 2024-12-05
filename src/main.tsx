import { createRoot } from 'react-dom/client';
import { ConfigProvider} from '@/contexts/ConfigContext';

import App from './App.tsx';
import './css/preflight.scss';
import './css/style.css';
import './css/style.scss';



window.Tido = function Tido(config = {}) {
    createRoot(document.getElementById('app')!).render(<ConfigProvider><App customConfig={config} /></ConfigProvider>);
};



export default window.Tido;