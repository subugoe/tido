import { FC, useEffect, useState } from 'react'

import { contentStore } from '@/store/ContentStore'
import { usePanel } from '@/contexts/PanelContext'

import TextViewOne from '@/components/panel/views/TextViewOne'
import TextView from '@/components/panel/views/TextView'
import SplitView from '@/components/panel/views/SplitView'
import ImageView from '@/components/panel/views/ImageView'

import ErrorComponent from '@/components/ErrorComponent'

import { request } from '@/utils/http'

const PanelCentralContent: FC = () => {
  const { panelId } = usePanel()

  const viewIndex = contentStore((state) => state.panels[panelId].viewIndex)
  const activeContentTypeIndex = contentStore(
    (state) => state.panels[panelId].contentIndex
  )
  const [text, setText] = useState<string>('')
  const content = contentStore((state) => state.panels[panelId].item.content)

  const [error, setError] = useState<boolean | string>(false)

  useEffect(() => {
    async function updateText(contentUrl: string) {
      const response = await request<string>(contentUrl)

      if (!response.success) {
        setError(response.message)
        return
      }

      setText(response.data)
    }

    const contentUrl = content[activeContentTypeIndex].url ?? null

    if (!contentUrl) {
      setError('Error: No content URL found.')
      return
    }

    updateText(contentUrl)
  }, [activeContentTypeIndex])

  if (error) {
    return <ErrorComponent message={error} />
  }

  if (viewIndex === 0) {
    return <TextViewOne textHtml={text} />
  } else if (viewIndex === 1) {
    return <TextView textHtml={text} />
  } else if (viewIndex === 2) {
    return <SplitView textHtml={text} />
  } else if (viewIndex === 3) {
    return <ImageView />
  }
}

export default PanelCentralContent
