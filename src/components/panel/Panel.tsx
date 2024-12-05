import { FC, useState, useEffect } from 'react';
import CustomHTML from '@/components/CustomHTML';
import ContentTypesToggle from '@/components/panel/ContentTypesToggle';
import {useConfig} from '@/contexts/ConfigContext'


import { readApi } from '@/utils/http';
import { getPanel } from '@/utils/panel';

interface PanelProps {
  url: string | null
}

// prop: url - should be the url of collection or manifest
const Panel: FC <PanelProps> = ({ url }) => {
  const { config } = useConfig()
  const [text, setText] = useState<React.ReactNode | undefined>();
  const [textTypes, setTextTypes] = useState<string[]>([]);
  const [activeText, setActiveText] = useState('');


  async function getItemUrl(documentData: Manifest | Collection): Promise<string | null> {
    // if collection - then we should read the api data from the manifest and get its first sequence item id
    // if manifest - we retrieve the first sequence item id

    // panel in the config having a document with the prop url
    const panel: Panel | undefined = getPanel(url, config)
    if (!panel) return null

    if (!('collection' in panel) && !('manifest' in panel)) return null

    if ('collection' in panel) {
      // 'title' in document -> document is collection
      const manifestData = await readApi(documentData.sequence[0].id);
      return manifestData.sequence[0].id;
    }

    if ('manifest' in panel) {
      return documentData.sequence[0].id;
    }
    return null
  }

  function assignContentTypes(itemData: Item) {
    if (!itemData.hasOwnProperty('content')) return;
    if (itemData.content.length === 0) return;

    const content = itemData.content;
    const types: string[] = content.map((item) => getContentType(item.type));
    setTextTypes(types);
  }

  function getContentType(value: string): string {
    if (!value) return '';
    return value.split('type=')[1];
  }

  async function readData(url: string | undefined | null) {
    if (!url || url === '') return 
    let documentData;
    try {
      const apiData = await fetch(url);
      if (!apiData.ok) {
        console.log('response is not ok----')
        throw Error('Response is not ok while loading document data')
      }
      documentData = await apiData.json();

    } catch (e: any) {
      console.error('Error:', e.message, 'from given Panel url')
    }
    
    //const documentData = await readApi(url);
    const itemUrl: string | null = await getItemUrl(documentData);
    if (!itemUrl) return

    const itemData = await readApi(itemUrl);
    assignContentTypes(itemData);
    const itemHtmlUrl = getUrlActiveText(itemData['content']);

    const textInHtml = await readHtml(itemHtmlUrl);
    setText(<CustomHTML textHtml={textInHtml} />);
  }

  async function readHtml(url: string | undefined): Promise<string> {
    // url: the url of html file of the item
    if (!url) {
      console.error('url of the html content text file is undefined!!')
      return ''
    }
    const data = await fetch(url);
    const text = await data.text();

    return text;
  }

  function getUrlActiveText(content: Content[]): string | undefined {
    
    const activeContent: Content | undefined = content.find((item) => item.type.includes(activeText))
    if (!activeContent) {
      console.error('the current text content was not found')
      return undefined
    }
    return activeContent.url ? activeContent.url : undefined
  }

  useEffect(() => {
    // read Api data from url
    readData(url);
  }, [url, activeText]);

  return (
    <div className="panel t-flex t-flex-col t-w-[600px] t-ml-[6%] t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-[15px] t-px-[10px] t-pt-[150px] t-pb-[25px]">
      <div className="t-flex t-flex-col t-items-center t-mb-[25px]">
        <ContentTypesToggle
          textTypes={textTypes}
          activeText={activeText}
          setActiveText={setActiveText}
        />
      </div>
      {text}
    </div>
  );
};

export default Panel;
