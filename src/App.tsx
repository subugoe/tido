import { FC, useEffect, useState } from "react";
import defaultConfig from "./config";
import "primeicons/primeicons.css";
import TopBar from "./components/TopBar/TopBar";
import { ConfigContext } from "./contexts/ConfigContext";

import { getDocumentNode } from "./utils/tree";

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [treeNodes, setTreeNodes] = useState([]);
  const [key, setKey] = useState(-1);

  const createTree = async () => {
    const panels = config.panels;
    if (!panels || panels.length === 0) return;

    let key = -1;
    panels.forEach(async (panel) => {
      // one node has 'key', 'label' and 'children' attributes
      key += 1;
      await createDocumentNode(panel, key);
    });
  };

  async function createDocumentNode(panel, key) {
    let node: {};
    if ("collection" in panel) {
      node = await getDocumentNode(panel.collection, "collection", key);
      // create collection node and append it to nodes -> setNodes
    } else if ("manifest" in panel) {
      node = await getDocumentNode(panel.manifest, "manifest", key);
    }
    console.log("node", node);
    //setKey((prevKey) => prevKey + 1);
    setTreeNodes((prevNodes) => [...prevNodes, node]);
  }

  useEffect(() => {
    createTree();
  }, []);

  return (
    <div className="tido">
      <ConfigContext.Provider
        value={{
          config,
          setConfig,
          treeNodes,
          setTreeNodes,
        }}
      >
        {" "}
        <span>Number of nodes {treeNodes.length}</span>
        <TopBar />
      </ConfigContext.Provider>
    </div>
  );
}

export default App;
