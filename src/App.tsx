import PanelsWrapper from './components/PanelsWrapper'
import { FC } from 'react'
import { ConfigProvider } from '@/contexts/ConfigContext'

interface AppProps {
  customConfig: Config
}

const App: FC <AppProps> = ({ customConfig }) => {

  return (
    <ConfigProvider customConfig={customConfig}>
      <div className="tido">
        <PanelsWrapper /> 
      </div>
    </ConfigProvider>
  )
}

export default App