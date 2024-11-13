import { FC, useState, useEffect, useContext } from "react";
import { ConfigContext } from "@/contexts/ConfigContext";
import { getUrls } from "@/utils/config";

const TopBar: FC = () => {
  //const [collectionsData, setCollectionsData] = useState([''])
  const { config, setConfig } = useContext(ConfigContext);
  const [urls, setUrls] = useState(getUrls(config.documents));
  const [labels, setLabels] = useState([]);

  const manifestLabels =
    labels.length > 0 &&
    labels.map((label, i) => (
      <span
        key={i}
        className="t-bg-slate-200 t-w-[100px] t-truncate t-p-[5px] t-mr-[20px]"
        title={label}
      >
        {label}
      </span>
    ));

  useEffect(() => {
    async function initManifestsLabels(urls) {
      let list: string[] = [];
      if (!urls) return [""];
      urls.forEach((url) => {
        const label = getLabel(url);
        list.push(label);
      });
      Promise.all(list).then((values) => {
        setLabels(values);
      });
    }

    async function getLabel(url) {
      const apiData = await fetch(url);
      const data = await apiData.json();
      if (!data) return;
      if (data.sequence[0].type === "manifest") {
        return data.sequence[0].label;
      }
      if (data.sequence[0].type === "item") {
        return data.label;
      }
    }

    initManifestsLabels(urls);
  }, []);

  return <div className="t-flex t-mt-[5%] t-ml-[5%]">{manifestLabels}</div>;
};

export default TopBar;
