import { FC, useEffect, useState } from "react";
import defaultConfig from "./config";
import { ConfigContext } from "./contexts/ConfigContext";
import Panel from "@/components/panel/Panel";

import { readApi } from "@/utils/http";
import PanelsWrapper from "./components/PanelsWrapper";

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [openedPanels, setOpenedPanels] = useState(defaultConfig.panels);

  function initOpenedPanels(panels) {
    setOpenedPanels((prevValue) => panels);
  }
  useEffect(() => {
    initOpenedPanels(config.panels);
  }, []);

  return (
    <div className="tido">
      <ConfigContext.Provider
        value={{
          config,
          setConfig,
          openedPanels,
        }}
      >
        <span> Welcome to TIDO</span>
        <PanelsWrapper />
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
