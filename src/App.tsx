import { FC, useState } from "react";
import defaultConfig from "./config";
import "primeicons/primeicons.css";
import TopBar from "./components/TopBar/TopBar";
import { ConfigContext } from "./contexts/ConfigContext";

function App() {
  const [config, setConfig] = useState(defaultConfig);

  return (
    <div className="tido">
      <ConfigContext.Provider
        value={{
          config,
          setConfig,
        }}
      >
        <TopBar />
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
