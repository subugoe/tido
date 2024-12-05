import PanelsWrapper from './components/PanelsWrapper';
import { useEffect, useState } from 'react';
import { useConfig} from '@/contexts/ConfigContext'



function App({customConfig}) {

  const [loading, setLoading] = useState(true)
  const [resultConfig, setResultConfig] = useState()
  const { config, updateConfig} = useConfig()

  useEffect(() => {
    // load Config
    // TODO: url config will need to get read
    function loadConfig() {
      const totalConfig = {...config, ...customConfig}
      updateConfig(totalConfig)
      setLoading(false)
    }
    loadConfig()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="tido">
        <span> Welcome to TIDO</span>
        <PanelsWrapper />
    </div>
  );
}

export default App;