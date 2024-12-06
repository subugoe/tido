import { FC, useState, useEffect } from 'react';
import {useConfig} from '@/contexts/ConfigContext'

import { readApi } from '@/utils/http';
import { getPanel, readHtml, getUrlActiveText } from '@/utils/panel';


import CustomHTML from '@/components/CustomHTML';
import ContentTypesToggle from '@/components/panel/ContentTypesToggle';
import Error from '@/components/Error'

interface PanelProps {
  url: string | null
}

// prop: url - should be the url of collection or manifest
const Panel: FC <PanelProps> = ({ url }) => {
  const { config } = useConfig()
  const [text, setText] = useState<string>('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [activeContentType, setActiveContentType] = useState('');

  const [error, setError] = useState<boolean | string>(false)
  const [loading, setLoading] = useState<boolean>(true)


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

  async function assignContentTypes(itemData: Item) {
    if (!itemData.hasOwnProperty('content')) return;
    if (itemData.content.length === 0) return;

    const content: Content[] = itemData.content;
    const types: string[] = content.map((item) => getContentType(item.type));
    setContentTypes(types);
  }

  function getContentType(value: string): string {
    if (!value) return '';
    return value.split('type=')[1];
  }

  async function readData(url: string | undefined | null) {
    if (!url || url === '') return 
    let documentData: Manifest | Collection;

    // read document (collection/manifest) data
    try {
      const apiData = await fetch(url);
      if (!apiData.ok) {
        throw Error('Error while loading document data of this url ', url)
      }
      if (!apiData.headers.get('content-type')?.includes('application/json')) {
        throw Error('Response from reading this document (collection/manifest) is not a json object')
      }
      await apiData.json().then((value) => {
        documentData = value
       }
      )

    } catch (e: any) {
      setError('Error while loading document data of this url '+ url)
      return
    }

    // read item data
    
    let itemUrl: string | null = await getItemUrl(documentData);
    if (!itemUrl) return

    let itemData: Item
    try {
      const response = await fetch(itemUrl)
      if (!response.ok) {
        throw Error('failed to fetch from item URL')
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw Error('Response from reading item is not a json object')
      }
      await response.json().then((value) => {
        itemData = value
       }
      )
    } catch (e: any) {
      setError(e.message)
      return
    }
    await assignContentTypes(itemData);
    //setActiveContentType(contentTypes[0])
    const itemHtmlUrl = getUrlActiveText(itemData.content, activeContentType);

    const textInHtml = await readHtml(itemHtmlUrl);
    setText(textInHtml);
    setLoading(false)
  }


  useEffect(() => {
    // read Api data from url
    readData(url);
  }, [url, activeContentType]);


  if (error) {
    return <Error message={error} />
  }

  if (loading) {
    return <div> Loading the data of this panel...</div>
  }

  return (
    <div className="panel t-flex t-flex-col t-w-[600px] t-ml-[6%] t-border-solid t-border-2 t-border-slate-200 t-rounded-lg t-mt-4 t-px-2.5 t-pt-8 t-pb-6">
      <div className="t-flex t-flex-col t-items-center t-mb-6">
        <ContentTypesToggle
            contentTypes={contentTypes}
            activeContentType={activeContentType}
            setActiveContentType={setActiveContentType}
          />
      </div>
      <CustomHTML textHtml={text}/>
    </div>
  );
};

export default Panel;
