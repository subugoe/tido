import { createContext, useContext, useState } from 'react';
import defaultConfig from '@/config';
const ConfigContext = createContext({});

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [openedPanels, setOpenedPanels] = useState(defaultConfig.panels);

  function updateConfig(newConfig) {
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

const useConfig = () => {
  return useContext(ConfigContext);
};

export { ConfigProvider, useConfig };
