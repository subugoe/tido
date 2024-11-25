import { FC, useState, useEffect, useContext } from "react";
import { ConfigContext } from "@/contexts/ConfigContext";
import { getUrls } from "@/utils/config";
import { Tree } from "primereact/tree";

import { getDocumentNode } from "../utils/tree";
const TreeView: FC = ({}) => {
  const [nodes, setNodes] = useState([]);
  const [key, setKey] = useState(-1);
  const { config, setConfig } = useContext(ConfigContext);
  const panels = config.panels;

  async function createDocumentNode(panel) {
    let node;
    if ("collection" in panel) {
      node = await getDocumentNode(panel.collection, "collection", key + 1);
      // create collection node and append it to nodes -> setNodes
    } else if ("manifest" in panel) {
      node = await getDocumentNode(panel.manifest, "manifest", key + 1);
    }
    setKey((prevKey) => prevKey + 1);
    setNodes((prevNodes) => [...prevNodes, node]);
  }

  const createTree = async () => {
    console.log("panels", panels);
    if (!panels || panels.length === 0) return;

    panels.forEach(async (panel) => {
      // one node has 'key', 'label' and 'children' attributes
      await createDocumentNode(panel);
    });
  };

  useEffect(() => {
    // create a manifest node and append it to nodes -> setNodes
    createTree();
  }, []);

  //NodeService.getTreeNodes().then((data) => setNodes(data));

  // iterate through each panel in config
  // if panel has collection show collection, manifest, item
  // if panel has manifest, show manifest, item
  return (
    <div>
      <Tree
        pt={{ subgroup: { className: "t-ml-[10px]" } }}
        value={nodes}
        className="w-full md:w-30rem"
      />
      <span> key: {key}</span>
      <span> Number of nodes: {nodes.length}</span>
    </div>
  );
};

export default TreeView;
