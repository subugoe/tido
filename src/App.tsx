import PanelsWrapper from './components/PanelsWrapper'
import { FC, useEffect, useState } from 'react'
import { useConfig} from '@/contexts/ConfigContext'

interface AppProps {
  customConfig: Config
}

const App: FC <AppProps> = ({ customConfig }) => {

  const [loading, setLoading] = useState(true)
  const { config, setConfig } = useConfig()

  useEffect(() => {
    // load Config
    // TODO: url config will need to get read
    function loadConfig() {
      const totalConfig = {...config, ...customConfig}
      if (setConfig) {
        setConfig(totalConfig)
      }
      setLoading(false)
    }
    loadConfig()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="tido">
        <PanelsWrapper />
    </div>
  )
}

export default App