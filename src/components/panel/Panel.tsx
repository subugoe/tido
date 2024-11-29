import {
  FC,
  useState,
  useEffect,
  useContext,
  createElement,
  Fragment,
} from "react";
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

  async function readData(url: string) {
    const documentData = await readApi(url);
    const itemUrl = await getItemUrl(documentData);
    const itemData = await readApi(itemUrl);
    const itemHtmlUrl = itemData["content"][0]["url"];

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
  useEffect(() => {
    // read Api data from url
    readData(url);
  }, [url]);

  return (
    <div className="t-w-[600px] t-ml-[6%] t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-[15px] t-px-[10px] t-pt-[150px] t-pb-[25px]">
      {text}
    </div>
  );
};

export default Panel;
