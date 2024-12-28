import { FC, useEffect, useState } from 'react';

import { contentStore } from '@/store/ContentStore'
import { useConfig } from '@/contexts/ConfigContext'

import TextViewOne from '@/components/panel/central-content/TextViewOne';
import TextView from '@/components/panel/central-content/TextView'
import SplitView from '@/components/panel/central-content/SplitView';
import ImageView from '@/components/panel/central-content/ImageView'

import ErrorComponent from '@/components/ErrorComponent'

import { request } from '@/utils/http'


interface PanelCentralContentProps {
  textHtml: string,
  panelIndex: number
}


const PanelCentralContent: FC<PanelCentralContentProps> = ({ textHtml, panelIndex }) => {

  const {config} = useConfig()
  
  const [textViewIndex, setTextViewIndex] = useState(contentStore(state => state.items[panelIndex].v))
  const activeContentTypeIndex = contentStore(state => state.items[panelIndex].t)
  const [text, setText] = useState<string>(textHtml)
  const [content, setContent] = useState(contentStore(state => state.items[panelIndex].item.content))

  const [error, setError] = useState<boolean | string>(false)

  
  useEffect(() => {
    setTextViewIndex(textViewIndex)
    
  }, [config])

  useEffect(() => {
    
    async function updateText(contentUrl: string) {
        const response = await request<string>(contentUrl)

        if (!response.success) {
          setError(response.message)
          return
        }

        setText(response.data)
    }
    
    let contentUrl = content[activeContentTypeIndex].url ?? null

    if (!contentUrl) {
      setError('Error: No content URL found.')
      return
    }

    updateText(contentUrl)

  }, [activeContentTypeIndex])

  if (error) {
    return <ErrorComponent message={error} />
  }

  if (textViewIndex === 0) {
    return <TextViewOne textHtml = {text}/>
  }
  else if (textViewIndex === 1) {
    return <TextView textHtml = {text} />
  }
  else if (textViewIndex === 2) {
    return <SplitView textHtml = {text} />
  }
  else if (textViewIndex === 3) {
    return <ImageView />
  }


  return (
    <div className="">
    </div>
  );
};

export default PanelCentralContent;