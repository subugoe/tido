import { ReactNode, createContext, useContext, useState, FC } from 'react'
const ConfigContext = createContext({})

interface ConfigProvider {
  config?: Config,
  setConfig?: (newConfig: Config) => void,
  openedPanels?: PanelConfig[],
  setOpenedPanels?: (panels: PanelConfig[]) => void
}

interface ConfigProviderProps{
  children?: ReactNode,
  customConfig: Config
}

const ConfigProvider: FC<ConfigProviderProps> = ({ children, customConfig }) => {
  const [config, setConfig]  = useState <Config>(customConfig)
  const [openedPanels, setOpenedPanels] = useState(customConfig.panels)

  return (
    <ConfigContext.Provider value={{ config, setConfig, openedPanels, setOpenedPanels }}>
      {children}
    </ConfigContext.Provider>
  )
}

function useConfig(): ConfigProvider {
  return useContext(ConfigContext)
}

export { ConfigProvider, useConfig }
