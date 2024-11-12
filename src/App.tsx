import TopBar from './components/TopBar/TopBar';
import { FC, useState } from 'react';
import defaultConfig from './config';
import { ConfigContext } from './contexts/ConfigContext';

function App() {
    const [config, setConfig] = useState(defaultConfig);

    return (
        <>
            <ConfigContext.Provider
                value={{
                    config,
                    setConfig,
                }}
            >
                <TopBar />
                <h1>Hi!</h1>
            </ConfigContext.Provider>
        </>
    );
}

export default App;
