import { FC, useState, useEffect, useContext } from "react";
import { ConfigContext } from "@/contexts/ConfigContext";
import { getUrls } from "@/utils/config";
import { Tree } from "primereact/tree";
const TreeView: FC = ({}) => {
  const [nodes, setNodes] = useState([]);
  const [key, setKey] = useState(-1);
  const { config, setConfig } = useContext(ConfigContext);
  const panels = config.panels;

  useEffect(() => {
    async function getCollectionNode(url) {
      console.log("getting collection node");
      let node = {};
      const apiData = await fetch(url);
      const data = await apiData.json();
      const thisKey = key + 1;
      setKey((key) => thisKey);
      node["key"] = thisKey.toString();
      node["label"] = data.title[0].title;
      node["children"] = await getChildrenNodes(node["key"], data.sequence);
      console.log("collection node", node);
      return node;
    }

    async function getManifestNode(url) {
      console.log("getting manifest node");
      let node = {};
      const apiData = await fetch(url);
      const data = await apiData.json();
      const thisKey = key + 1;
      setKey((key) => thisKey);
      node["key"] = thisKey.toString();
      node["label"] = data.label;
      node["children"] = await getChildrenNodes(node["key"], data.sequence);
      return node;
    }

    async function getChildrenNodes(parentKey, items) {
      let nodes = [];
      if (!items || items.length === 0) return [];
      for (let i = 0; i < items.length; i++) {
        let node = {};
        node["key"] = parentKey + "-" + i.toString();
        node["label"] = items[i].label;
        const apiData = await fetch(items[i].id);
        const data = await apiData.json();
        node["children"] = await getChildrenNodes(node["key"], data.sequence);
        nodes.push(node);
      }
      // each node should have children - which will be items
      return nodes;
    }

    console.log("panels", panels);
    if (!panels || panels.length === 0) return;

    //const node = getCollectionNode(panels[0].collection);

    panels.forEach(async (panel) => {
      // one node has 'key', 'label' and 'children' attributes
      console.log("panel", panel);
      if ("collection" in panel) {
        const collectionNode = await getCollectionNode(panel.collection);
        setNodes((nodes) => [...nodes, collectionNode]);
        // create collection node and append it to nodes -> setNodes
      } else if ("manifest" in panel) {
        const manifestNode = await getManifestNode(panel.manifest);
        console.log("nodes", nodes);
        setTimeout(() => {
          setNodes((nodes) => [...nodes, manifestNode]);
        }, 1000);
      }

      // create a manifest node and append it to nodes -> setNodes
    });

    //NodeService.getTreeNodes().then((data) => setNodes(data));
  }, []);

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
    </div>
  );
};

export default TreeView;
