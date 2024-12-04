import { ReactNode, createContext, useContext, useState, FC } from 'react';
import defaultConfig from '@/config';
const ConfigContext = createContext({});

interface ConfigProvider {
  config?: Config,
  setConfig?: () => void,
  openedPanels?: Panel[],
  setOpenedPanels?: (panels: Panel[]) => void
}

interface ConfigProviderProps {
  children?: ReactNode
}

const ConfigProvider: FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig]  = useState <Config>(defaultConfig);
  const [openedPanels, setOpenedPanels] = useState(defaultConfig.panels);

  function updateConfig(newConfig: Config) {
    setConfig(newConfig);
  }

  return (
    <ConfigContext.Provider
      value={{ config, updateConfig, openedPanels, setOpenedPanels }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

function useConfig(): ConfigProvider {
  return useContext(ConfigContext)
}



export { ConfigProvider, useConfig };
