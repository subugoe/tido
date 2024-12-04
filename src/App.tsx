import { ConfigProvider } from '@/contexts/ConfigContext';
import PanelsWrapper from './components/PanelsWrapper';

function App() {
  return (
    <div className="tido">
      <ConfigProvider>
        <span> Welcome to TIDO</span>
        <PanelsWrapper />
      </ConfigProvider>
    </div>
  );
}

export default App;
