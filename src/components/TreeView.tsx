import { FC, useState, useEffect, useContext } from "react";
import { ConfigContext } from "@/contexts/ConfigContext";
import { getUrls } from "@/utils/config";
import { Tree } from "primereact/tree";
const TreeView: FC = ({}) => {
  const [nodes, setNodes] = useState([]);
  const [key, setKeys] = useState(-1);
  const { config, setConfig } = useContext(ConfigContext);
  const panels = config.panels;

  async function getManifestNode(url) {}
  useEffect(() => {
    async function getCollectionNode(url) {
      console.log("getting collection node");
      let node = {};
      const apiData = await fetch(url);
      const data = await apiData.json();
      const thisKey = key + 1;
      node["key"] = thisKey.toString();
      node["label"] = data.title[0].title;
      node["children"] = await getChildrenNodes(node["key"], data.sequence);
      console.log("collection node", node);
      setNodes([node]);
      return [node];
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
        //node["children"] = await getChildrenNodes(node["key"], data.sequence);
        nodes.push(node);
      }
      // each node should have children - which will be items
      return nodes;
    }

    console.log("panels", panels);
    if (!panels || panels.length === 0) return;
    const node = getCollectionNode(panels[0].collection);

    /*
    panels.forEach((panel) => {
      // one node has 'key', 'label' and 'children' attributes
      if ("collection" in panel) {
        // create collection node and append it to nodes -> setNodes
      } else if ("manifest" in panel) {
        // create a manifest node and append it to nodes -> setNodes
      }
    });
    */
    //NodeService.getTreeNodes().then((data) => setNodes(data));
  }, []);

  // iterate through each panel in config
  // if panel has collection show collection, manifest, item
  // if panel has manifest, show manifest, item
  return (
    <div>
      <Tree value={nodes} className="w-full md:w-30rem" />
    </div>
  );
};

export default TreeView;
