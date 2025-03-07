import { FC, useEffect, useState } from 'react'

import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'

import TextViewOne from '@/components/panel/views/TextViewOne'
import TextView from '@/components/panel/views/TextView'
import SplitView from '@/components/panel/views/SplitView'
import ImageView from '@/components/panel/views/ImageView'

import ErrorComponent from '@/components/ErrorComponent'

import { Skeleton } from '@/components/ui/skeleton.tsx'
import EmptyMessage from '@/components/panel/EmptyMessage.tsx'
import { apiRequest } from '@/utils/api.ts'

const PanelCentralContent: FC = () => {
  const { panelId, panelState, loading } = usePanel()

  const activeContentTypeIndex = usePanelStore(
    (state) => panelId && state.panels[panelId] ? state.panels[panelId].contentIndex : 0
  )
  const [text, setText] = useState<string>('')

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function updateText(contentUrl: string) {
      try {
        const response = await apiRequest<string>(contentUrl)
        setText(response)
      } catch (e) {
        setError((e as ErrorResponse).message)
        console.error(e)
      }
    }

    const contentUrl = panelState?.item?.content[0].url ?? null
    if (contentUrl) updateText(contentUrl)
  }, [panelState, activeContentTypeIndex])

  if (error) return <ErrorComponent message={error} />
  if (loading) return <Skeleton className="t-w-full t-h-full" />
  if (!panelState || !panelState.item) return <EmptyMessage />

  if (panelState.viewIndex === 0) {
    return <TextViewOne textHtml={text} />
  } else if (panelState.viewIndex === 1) {
    return <TextView textHtml={text} />
  } else if (panelState.viewIndex === 2) {
    return <SplitView textHtml={text} />
  } else if (panelState.viewIndex === 3) {
    return <ImageView />
  }
}

export default PanelCentralContent
