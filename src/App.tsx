import { FC, useEffect, useState } from "react";
import defaultConfig from "./config";
import "primeicons/primeicons.css";
import { ConfigContext } from "./contexts/ConfigContext";

function App() {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {}, []);

  return (
    <div className="tido">
      <ConfigContext.Provider
        value={{
          config,
          setConfig,
        }}
      ></ConfigContext.Provider>
    </div>
  );
}

export default App;
