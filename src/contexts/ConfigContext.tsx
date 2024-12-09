import { ReactNode, createContext, useContext, useState, FC } from 'react';
import defaultConfig from '@/config';
const ConfigContext = createContext({});

interface ConfigProvider {
  config?: Config,
  setConfig?: (newConfig: Config) => void,
  openedPanels?: PanelConfig[],
  setOpenedPanels?: (panels: PanelConfig[]) => void
}

interface ConfigProviderProps{
  children?: ReactNode
}

const ConfigProvider: FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig]  = useState <Config>(defaultConfig);
  const [openedPanels, setOpenedPanels] = useState(defaultConfig.panels);

  return (
    <ConfigContext.Provider
      value={{ config, setConfig, openedPanels, setOpenedPanels }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

function useConfig(): ConfigProvider {
  return useContext(ConfigContext)
}



export { ConfigProvider, useConfig };