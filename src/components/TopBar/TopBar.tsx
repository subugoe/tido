import { FC, useState, useEffect, useContext, useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { ConfigContext } from "@/contexts/ConfigContext";
import { getUrls } from "@/utils/config";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const TopBar: FC = () => {
  //const [collectionsData, setCollectionsData] = useState([''])
  const { config, setConfig } = useContext(ConfigContext);
  const [urls, setUrls] = useState(getUrls(config.panels));
  const [labels, setLabels] = useState([]);
  const [visible, setVisible] = useState(false);
  const newButton = useRef(null);
  const [value, setValue] = useState("");

  const manifestLabels =
    labels.length > 0 &&
    labels.map((label, i) => (
      <span
        key={i}
        className="t-bg-slate-200 t-w-[200px] t-truncate t-p-[5px] t-mr-[20px]"
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

  return (
    <div className="t-flex t-mt-[5%] t-ml-[5%]">
      {manifestLabels}
      <span>
        <Button
          icon="pi pi-plus"
          label="New"
          pt={{
            root: {
              className:
                "t-bg-blue-500 t-text-white t-rounded t-flex t-items-center t-justify-items-center t-w-[70px] t-h-[34px]",
            },
          }}
          onClick={(e) => {
            setVisible(true);
            newButton.current.toggle(e);
            console.log("new Button", newButton);
          }}
        />
        <OverlayPanel
          ref={newButton}
          pt={{
            root: {
              className: "t-border-[2px] t-border-slate-500 t-border-solid",
            },
            content: { className: "" },
          }}
          style={{
            position: "absolute",
            borderWidth: "2px",
            borderColor: "#f3f4f6",
            borderStyle: "solid",
            backgroundColor: "white",
            padding: "5px 10px",
            borderRadius: 3,
          }}
        >
          <div className="t-flex t-flex-col t-bg-blue-300">
            <span>Enter a collection/manifest Url</span>
            <div style={{ marginTop: "10px" }}>
              <InputText
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
        </OverlayPanel>
      </span>
    </div>
  );
};

export default TopBar;
