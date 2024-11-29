import { FC, useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";

import { ConfigContext } from "@/contexts/ConfigContext";
import CustomHTML from "@/components/CustomHTML";

import { readApi } from "@/utils/http";

// TODO: add a Typescript interface for the props types
// prop: url - should be the url of collection or manifest
const Panel: FC = ({ url }) => {
  const { config, setConfig } = useContext(ConfigContext);
  const [data, setData] = useState();
  const [itemUrl, setItemUrl] = useState("");
  const [text, setText] = useState<React.ReactNode | undefined>();
  const [textTypes, setTextTypes] = useState([]);
  const [activeText, setActiveText] = useState("");
  const [numberTexts, setNumberTexts] = useState(0);

  async function getItemUrl(documentData): string {
    // if collection - then we should read the api data from the manifest and get its first sequence item id
    // if manifest - we retrieve the first sequence item id
    if ("title" in documentData) {
      // 'title' in document -> document is collection
      const manifestData = await readApi(documentData.sequence[0].id);
      return manifestData.sequence[0].id;
    }

    if ("label" in documentData) {
      return documentData.sequence[0].id;
    }
  }

  function assignTextTypes(itemData: Item) {
    let types: string[] = [];
    if (!itemData.hasOwnProperty("content")) return;
    if (itemData["content"].length === 0) return;

    const content = itemData["content"];
    for (let i = 0; i < content.length; i++) {
      types.push(getContentType(content[i].type));
    }
    setTextTypes(() => types);
  }

  function getContentType(value): string {
    if (!value) return "";
    return value.split("type=")[1];
  }

  async function readData(url: string) {
    const documentData = await readApi(url);
    const itemUrl = await getItemUrl(documentData);
    const itemData = await readApi(itemUrl);
    assignTextTypes(itemData);
    const itemHtmlUrl = getUrlActiveText(itemData["content"]); //[0]["url"];

    const textInHtml = await readHtml(itemHtmlUrl);
    setText(<CustomHTML textHtml={textInHtml} />);
    //setText(textInHtml);
    // if ("content" in jsonData) setNumberTexts(jsonData["content"].length);
    //setData(documentData);
  }

  async function readHtml(url: string): Promise<string> {
    // url: the url of html file of the item
    const data = await fetch(url);
    const text = await data.text();

    return text;
  }

  function handleTextTabClick(e) {
    e.preventDefault();
    setActiveText(() => e.target.innerHTML);
  }

  function getUrlActiveText(content) {
    const activeItemUrl = content.find((item) =>
      item.type.includes(activeText)
    ).url;
    return activeItemUrl;
  }

  const textTypesButtons =
    textTypes.length > 0 &&
    textTypes.map((type, i) => (
      <Button
        className="t-p-[5px] t-rounded-[6px]"
        style={{ backgroundColor: activeText === type ? "#FFFFFF" : "" }}
        key={i}
        label={type}
        onClick={(e) => handleTextTabClick(e)}
      />
    ));

  useEffect(() => {
    // read Api data from url
    readData(url);
  }, [url, activeText]);

  return (
    <div className="panel t-flex t-flex-col t-w-[600px] t-ml-[6%] t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-[15px] t-px-[10px] t-pt-[150px] t-pb-[25px]">
      <div className="t-flex t-flex-col t-items-center t-mb-[25px]">
        <div className="buttons-text-views t-bg-gray-400 t-p-[3px] t-rounded-[6px] t-h-[35px]">
          {textTypesButtons}
        </div>
      </div>
      {text}
    </div>
  );
};

export default Panel;
