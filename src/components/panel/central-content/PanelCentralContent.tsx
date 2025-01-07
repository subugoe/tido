import { FC, useEffect, useState } from 'react'

import { contentStore } from '@/store/ContentStore'

import TextViewOne from '@/components/panel/central-content/TextViewOne'
import TextView from '@/components/panel/central-content/TextView'
import SplitView from '@/components/panel/central-content/SplitView'
import ImageView from '@/components/panel/central-content/ImageView'

import ErrorComponent from '@/components/ErrorComponent'

import { request } from '@/utils/http'

interface PanelCentralContentProps {
  panelId: string
}

const PanelCentralContent: FC<PanelCentralContentProps> = ({ panelId }) => {
  const textViewIndex = contentStore(
    (state) => state.openedPanels[panelId].textViewIndex
  )
  const activeContentTypeIndex = contentStore(
    (state) => state.openedPanels[panelId].contentIndex
  )
  const [text, setText] = useState<string>('')
  const content = contentStore(
    (state) => state.openedPanels[panelId].item.content
  )
  const imageUrl = contentStore(
    (state) => state.openedPanels[panelId].item.image?.id
  )

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

  if (textViewIndex === 0) {
    return <TextViewOne textHtml={text} />
  } else if (textViewIndex === 1) {
    return <TextView textHtml={text} />
  } else if (textViewIndex === 2) {
    return <SplitView textHtml={text} imageUrl={imageUrl} panelId={panelId} />
  } else if (textViewIndex === 3) {
    return <ImageView imageUrl={imageUrl} panelId={panelId} />
  }
}

export default PanelCentralContent
